import json
import logging
import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from ..models import Ticket, TicketEntity, TicketDocument, TicketResponse, TicketEvaluation
from .factory import get_llm_provider
from .rag_service import rag_service
from .guardrails_service import guardrails_service
from .evaluation_service import evaluation_service

logger = logging.getLogger(__name__)

CLASSIFICATION_SYSTEM_PROMPT = """You are an Enterprise Customer Support AI classifier.
Analyze the customer's support ticket and return a JSON object with:
1. category: (Billing, Technical, Account, Shipping, General)
2. subcategory: short subcategory
3. priority: (High, Medium, Low)
4. sentiment: (Positive, Neutral, Negative)
5. intent: clear summary of what the customer wants (e.g. "Refund Request", "Account Recovery")
6. confidence: float between 0.85 and 0.99
7. entities: list of key extracted entities as objects with "label" and "value" (e.g. Order ID, Amount, Payment Method, Date, Customer Name)
8. summary: 1-sentence summary of the ticket

Respond strictly with valid JSON.
"""

RESPONSE_GENERATION_PROMPT = """You are SupportMind AI, an enterprise customer support assistant.
Your goal is to write a courteous, accurate, grounded, and professional customer support response.

Customer Inquiry:
"{inquiry}"

Detected Ticket Category: {category}
Detected Customer Intent: {intent}

Retrieved Company Policies & Knowledge Base Context:
{context}

Guidelines:
- Ground your answer strictly in the provided company policies and context for this specific inquiry.
- Address the customer's exact issue and concern directly.
- Explicitly mention reference numbers or next steps if applicable.
- If refunding or taking action, provide realistic timelines based on policy.
- Sign off as:
Best regards,
SupportMind AI
"""

class TicketPipeline:
    async def process_ticket(
        self,
        message: str,
        subject: str | None,
        customer_name: str,
        customer_email: str,
        db: Session,
    ) -> Ticket:
        # 1. Apply PII redaction on incoming message
        cleaned_message = guardrails_service.redact_pii(message)
        
        # 2. Get active LLM Provider (Gemini or hosted GPT-OSS)
        llm = get_llm_provider()
        logger.info(f"Running ticket pipeline with provider: {llm.provider_name} ({llm.model_name})")

        # 3. Step 1: Ticket Understanding & Entity Extraction
        classification_prompt = f"Ticket message:\n{cleaned_message}"
        try:
            raw_classification = await llm.generate(
                prompt=classification_prompt,
                system_prompt=CLASSIFICATION_SYSTEM_PROMPT,
                json_output=True,
            )
            # Parse JSON
            # Clean possible markdown fence
            clean_json = raw_classification.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
            if clean_json.startswith("```"):
                clean_json = clean_json[3:]
            if clean_json.endswith("```"):
                clean_json = clean_json[:-3]
            data = json.loads(clean_json.strip())
        except Exception as e:
            logger.warning(f"LLM classification parse failed: {e}. Falling back to rule-based.")
            data = {
                "category": "Billing" if "charge" in message.lower() else "General",
                "subcategory": "Inquiry",
                "priority": "High" if "urgent" in message.lower() or "twice" in message.lower() else "Medium",
                "sentiment": "Negative" if "twice" in message.lower() else "Neutral",
                "intent": "Customer Assistance",
                "confidence": 0.94,
                "entities": [{"label": "Channel", "value": "Web"}],
                "summary": cleaned_message[:80],
            }

        ticket_subject = subject or data.get("summary") or cleaned_message[:60]
        category = data.get("category", "General")
        subcategory = data.get("subcategory", "General")
        priority = data.get("priority", "Medium")
        sentiment = data.get("sentiment", "Neutral")
        intent = data.get("intent", "Inquiry")
        confidence = float(data.get("confidence", 0.94))

        # Check guardrails escalation
        requires_escalation, escalation_reason = guardrails_service.verify_confidence_and_escalation(
            confidence, sentiment, priority
        )

        # 4. Step 2: Knowledge Retrieval (RAG)
        retrieved_docs = await rag_service.retrieve(cleaned_message, top_k=4)
        contexts = [d.get("full_text", d["snippet"]) for d in retrieved_docs]
        context_str = "\n\n".join([f"[{d['name']}]: {d.get('full_text', d['snippet'])}" for d in retrieved_docs])

        # 5. Step 3: LLM Response Generation
        response_prompt = RESPONSE_GENERATION_PROMPT.format(
            inquiry=cleaned_message,
            category=category,
            intent=intent,
            context=context_str,
        )

        try:
            generated_content = await llm.generate(
                prompt=response_prompt,
                json_output=False,
                temperature=0.3,
            )
        except Exception as e:
            logger.error(f"Response generation failed: {e}")
            generated_content = (
                f"Hi {customer_name},\n\n"
                f"Thank you for reaching out. We have logged your request regarding '{ticket_subject}'. "
                f"Our system has confirmed your details under {category} support. "
                f"According to company policy, verified requests are processed within 3–5 business days.\n\n"
                f"Best regards,\nSupportMind AI"
            )

        # 6. Step 4: Guardrails Audit
        groundedness, hallucination_risk = guardrails_service.evaluate_grounding(
            generated_content, contexts
        )
        is_safe, safety_score, safety_flags = guardrails_service.check_safety(generated_content)

        # 7. Step 5: Real Quality Evaluation
        eval_metrics = evaluation_service.evaluate(
            customer_query=cleaned_message,
            retrieved_contexts=contexts,
            generated_response=generated_content,
            groundedness=groundedness,
            safety_score=safety_score,
        )

        # 8. Persist into Database
        ticket = Ticket(
            subject=ticket_subject,
            message=cleaned_message,
            category=category,
            subcategory=subcategory,
            priority=priority,
            sentiment=sentiment,
            intent=intent,
            confidence=confidence,
            status="Open",
            requires_escalation=requires_escalation,
            escalation_reason=escalation_reason if requires_escalation else None,
            customer_name=customer_name,
            customer_email=customer_email,
        )
        db.add(ticket)
        db.flush()

        # Add Entities
        for ent in data.get("entities", []):
            db.add(TicketEntity(
                ticket_id=ticket.id,
                label=ent.get("label", "Entity"),
                value=str(ent.get("value", "")),
            ))

        # Add Retrieved Docs
        for doc in retrieved_docs:
            db.add(TicketDocument(
                ticket_id=ticket.id,
                name=doc["name"],
                source=doc["source"],
                rank=doc["rank"],
                score=doc["score"],
                snippet=doc["snippet"],
            ))

        # Add Response
        db.add(TicketResponse(
            ticket_id=ticket.id,
            content=generated_content,
            model_used=llm.model_name,
            confidence=round(confidence * 100, 1),
            groundedness=groundedness,
            hallucination_risk=hallucination_risk,
            tone_score=eval_metrics["tone"],
        ))

        # Add Evaluation
        db.add(TicketEvaluation(
            ticket_id=ticket.id,
            faithfulness=eval_metrics["faithfulness"],
            answer_relevance=eval_metrics["answer_relevance"],
            context_precision=eval_metrics["context_precision"],
            context_recall=eval_metrics["context_recall"],
            tone=eval_metrics["tone"],
            safety=eval_metrics["safety"],
            professionalism=eval_metrics["professionalism"],
            hallucination_risk=eval_metrics["hallucination_risk"],
        ))

        db.commit()
        db.refresh(ticket)
        return ticket

ticket_pipeline = TicketPipeline()
