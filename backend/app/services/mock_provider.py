import json
import re
from typing import Optional, Dict, Any
from .llm_provider import LLMProvider

class MockFallbackProvider(LLMProvider):
    """
    Intelligent heuristic fallback provider used when no API keys are configured,
    or during initial local testing, guaranteeing a 100% working demo without API errors.
    """
    @property
    def provider_name(self) -> str:
        return "mock_engine"

    @property
    def model_name(self) -> str:
        return "heuristic-local-v1"

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        json_output: bool = False,
        temperature: float = 0.2,
    ) -> str:
        text = prompt.lower()
        
        # Check if classification was requested
        if "classify" in prompt.lower() or "intent" in prompt.lower() or json_output:
            category = "General"
            subcategory = "Customer Support"
            priority = "Medium"
            sentiment = "Neutral"
            intent = "Information Request"
            confidence = 0.94

            if any(w in text for w in ["charged", "refund", "billing", "invoice", "payment", "credit card", "price", "subscription"]):
                category = "Billing"
                subcategory = "Duplicate Charge" if "twice" in text or "duplicate" in text else "Billing Dispute"
                intent = "Refund Request" if "refund" in text else "Billing Inquiry"
                priority = "High" if ("urgent" in text or "twice" in text or "immediately" in text or "unacceptable" in text) else "Medium"
            elif any(w in text for w in ["error", "bug", "crash", "500", "404", "api", "failed", "broken", "login"]):
                category = "Technical"
                subcategory = "API Error" if "api" in text else "Authentication Issue"
                intent = "Technical Support"
                priority = "High" if "500" in text or "broken" in text else "Medium"
            elif any(w in text for w in ["ship", "tracking", "delivery", "delay", "order", "warehouse", "arrived"]):
                category = "Shipping"
                subcategory = "Delivery Delay"
                intent = "Order Tracking"
                priority = "Medium"
            elif any(w in text for w in ["password", "reset", "email", "profile", "account", "settings"]):
                category = "Account"
                subcategory = "Account Security"
                intent = "Account Recovery"
                priority = "Medium"

            if any(w in text for w in ["angry", "unacceptable", "terrible", "worst", "hate", "ridiculous", "frustrated", "scam"]):
                sentiment = "Negative"
            elif any(w in text for w in ["thank", "great", "love", "awesome", "helpful", "appreciate"]):
                sentiment = "Positive"

            # Extract sample entities from text
            entities = []
            order_match = re.search(r"#?([A-Za-z0-9]{3,5}-\d{3,6})", prompt)
            if order_match:
                entities.append({"label": "Order ID", "value": f"#{order_match.group(1)}"})
            else:
                entities.append({"label": "Order ID", "value": "#8821-347"})

            amount_match = re.search(r"\$(\d+(?:\.\d{2})?)", prompt)
            if amount_match:
                entities.append({"label": "Amount", "value": f"${amount_match.group(1)}"})
            elif category == "Billing":
                entities.append({"label": "Amount", "value": "$149.00"})

            card_match = re.search(r"(?:visa|mastercard|amex|card)[\s•\-_]*(\d{4})", prompt, re.IGNORECASE)
            if card_match:
                entities.append({"label": "Payment Method", "value": f"Card ending in {card_match.group(1)}"})
            else:
                entities.append({"label": "Customer", "value": "Customer Account"})

            entities.append({"label": "Channel", "value": "Web Portal"})

            result = {
                "category": category,
                "subcategory": subcategory,
                "priority": priority,
                "sentiment": sentiment,
                "intent": intent,
                "confidence": confidence,
                "entities": entities,
                "summary": prompt[:120].strip() + ("..." if len(prompt) > 120 else "")
            }
            return json.dumps(result)

        # Generating customer response
        return (
            "Hi there,\n\n"
            "Thank you for contacting SupportMind AI customer support. I have reviewed your request regarding your recent inquiry.\n\n"
            "Our team is actively verifying the details in accordance with our standard service policies. "
            "If your issue involves an unauthorized or duplicate charge, our policy guarantees automatic reversal within 3–5 business days. "
            "Please rest assured that your satisfaction is our highest priority.\n\n"
            "If you need further assistance or would like to share additional information, simply reply to this ticket.\n\n"
            "Best regards,\nSupportMind AI Support Team"
        )
