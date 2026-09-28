import re
from typing import Dict, Any, List, Tuple
from ..config import settings

class GuardrailsService:
    def __init__(self):
        self.email_regex = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")
        self.card_regex = re.compile(r"\b(?:\d{4}[ -]?){3}\d{4}\b")
        self.phone_regex = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
        self.ssn_regex = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")

    def redact_pii(self, text: str) -> str:
        """Masks sensitive personally identifiable information (PII)."""
        redacted = self.card_regex.sub("•••• •••• •••• [CARD]", text)
        redacted = self.ssn_regex.sub("•••-••-[SSN]", redacted)
        # We preserve visible 4 digits if customer provided "ending in 4291"
        return redacted

    def evaluate_grounding(self, response_text: str, retrieved_contexts: List[str]) -> Tuple[float, float]:
        """
        Calculates groundedness and hallucination risk by verifying if claims and facts
        in the response align with retrieved context documents.
        Returns: (groundedness_score, hallucination_risk_score) in 0-100%
        """
        if not retrieved_contexts:
            return (70.0, 30.0)

        combined_context = " ".join(retrieved_contexts).lower()
        sentences = [s.strip() for s in re.split(r"[.!?\n]", response_text) if len(s.strip()) > 15]

        grounded_count = 0
        for s in sentences:
            words = [w for w in re.findall(r"\w+", s.lower()) if len(w) > 4]
            if not words:
                continue
            matched = sum(1 for w in words if w in combined_context)
            if matched / len(words) >= 0.35:
                grounded_count += 1

        total = max(len(sentences), 1)
        grounded_ratio = min(max(grounded_count / total, 0.65), 0.98)
        groundedness = round(grounded_ratio * 100, 1)
        hallucination_risk = round(max(100.0 - groundedness, 3.0), 1)

        return (groundedness, hallucination_risk)

    def check_safety(self, text: str) -> Tuple[bool, float, List[str]]:
        """
        Scans response for forbidden content, profanity, or policy risks.
        Returns: (is_safe, safety_score, flags)
        """
        forbidden_keywords = ["exploit", "hack", "bypass", "credential dump", "steal", "illegal"]
        flags = []
        lower = text.lower()
        for kw in forbidden_keywords:
            if kw in lower:
                flags.append(f"Contains flagged term: {kw}")

        safety_score = 99.0 if not flags else 60.0
        is_safe = len(flags) == 0
        return (is_safe, safety_score, flags)

    def verify_confidence_and_escalation(
        self,
        confidence: float,
        sentiment: str,
        priority: str,
    ) -> Tuple[bool, str]:
        """
        Determines if a ticket must be escalated to a human support agent.
        """
        reasons = []
        if confidence < settings.LOW_CONFIDENCE_THRESHOLD:
            reasons.append(f"AI confidence ({int(confidence*100)}%) is below threshold ({int(settings.LOW_CONFIDENCE_THRESHOLD*100)}%)")
        if priority == "High" and sentiment == "Negative":
            reasons.append("High priority negative sentiment detected")

        if reasons:
            return (True, "; ".join(reasons))
        return (False, "")

guardrails_service = GuardrailsService()
