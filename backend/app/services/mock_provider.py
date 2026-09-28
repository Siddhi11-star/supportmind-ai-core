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

        # Generating customer response dynamically based on inquiry context
        if any(w in text for w in ["ship", "delivery", "deliver", "days", "passed", "track", "transit", "package", "arrived"]):
            # Extract days or default
            days_match = re.search(r"(\d+)\s*days?", prompt, re.IGNORECASE)
            days_text = f"{days_match.group(1)} days" if days_match else "an extended period"
            return (
                "Hi there,\n\n"
                "Thank you for reaching out to SupportMind AI customer support. I understand you are inquiring about your order delivery and that "
                f"{days_text} have passed without arrival.\n\n"
                "According to our Global Shipping & Delivery SLA, standard delivery times are 3–5 business days. Because your shipment has significantly "
                "exceeded this delivery window, I have immediately initiated an urgent courier trace (Ref: #TRK-882134) with our logistics fulfillment team.\n\n"
                "Under our Delivery Guarantee Policy, if the carrier cannot confirm physical delivery within 48 hours, we will immediately offer you "
                "either an expedited free replacement or a 100% full refund.\n\n"
                "We sincerely apologize for this shipping delay and will notify you as soon as the carrier updates tracking.\n\n"
                "Best regards,\nSupportMind AI Support Team"
            )

        if any(w in text for w in ["error", "500", "404", "webhook", "api", "bug", "crash", "failed", "broken"]):
            return (
                "Hi there,\n\n"
                "Thank you for contacting SupportMind AI technical support. I have reviewed your report regarding the webhook server error.\n\n"
                "Our engineering team has received the alert and is actively inspecting the backend endpoint logs. "
                "In accordance with our API & Webhook Troubleshooting Guide, automated retries with exponential backoff are currently active to ensure "
                "no payload data is permanently lost.\n\n"
                "We are deploying a hotfix to resolve the upstream handler timeout and will update this ticket once service is fully restored.\n\n"
                "Best regards,\nSupportMind AI Support Team"
            )

        if any(w in text for w in ["password", "login", "reset", "email", "account", "mfa", "access"]):
            return (
                "Hi there,\n\n"
                "Thank you for contacting SupportMind AI support regarding your account access.\n\n"
                "For your security, we have initiated an identity verification checkpoint. Please check your registered email address for a secure, "
                "one-time password reset link valid for the next 30 minutes.\n\n"
                "If you continue experiencing difficulties logging in, simply reply to this ticket and our security team will assist you.\n\n"
                "Best regards,\nSupportMind AI Support Team"
            )

        # Default Billing / General inquiry response
        return (
            "Hi there,\n\n"
            "Thank you for contacting SupportMind AI customer support. I have reviewed your account regarding your recent billing inquiry.\n\n"
            "In accordance with our Refund Policy v3.2, duplicate charges and disputed transactions are verified against our payment gateway logs. "
            "Verified refunds are issued automatically within 3–5 business days back to your original payment method (Reference: #RF-882134).\n\n"
            "Please rest assured that your satisfaction is our highest priority. If you do not see the credit posted within 5 business days, please reply "
            "directly to this ticket and we will escalate immediately.\n\n"
            "Best regards,\nSupportMind AI Support Team"
        )
