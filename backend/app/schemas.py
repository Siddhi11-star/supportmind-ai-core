from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class TicketCreate(BaseModel):
    message: str = Field(..., min_length=3, description="Customer inquiry or issue description")
    subject: Optional[str] = None
    customer_name: Optional[str] = "Alex Stone"
    customer_email: Optional[str] = "alex.stone@example.com"

class TicketEntitySchema(BaseModel):
    label: str
    value: str

    class Config:
        from_attributes = True

class TicketDocumentSchema(BaseModel):
    name: str
    source: str
    rank: int
    score: float
    snippet: str

    class Config:
        from_attributes = True

class TicketResponseSchema(BaseModel):
    content: str
    model_used: str
    confidence: float
    groundedness: float
    hallucination_risk: float
    tone_score: float
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TicketEvaluationSchema(BaseModel):
    faithfulness: float
    answer_relevance: float
    context_precision: float
    context_recall: float
    tone: float
    safety: float
    professionalism: float
    hallucination_risk: float

    class Config:
        from_attributes = True

class TicketDetailSchema(BaseModel):
    id: str
    subject: str
    message: str
    category: str
    subcategory: str
    priority: str
    sentiment: str
    intent: str
    confidence: float
    status: str
    requires_escalation: bool
    escalation_reason: Optional[str] = None
    customer_name: str
    customer_email: str
    created_at: datetime
    updated_at: datetime
    entities: List[TicketEntitySchema] = []
    retrieved_docs: List[TicketDocumentSchema] = []
    response: Optional[TicketResponseSchema] = None
    evaluation: Optional[TicketEvaluationSchema] = None

    class Config:
        from_attributes = True

class TicketListItemSchema(BaseModel):
    id: str
    subject: str
    category: str
    priority: str
    confidence: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentSchema(BaseModel):
    id: str
    name: str
    source: str
    category: str
    chunk_count: int
    snippet: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SystemSettingsSchema(BaseModel):
    active_provider: str
    gemini_model: str
    gemini_configured: bool
    gpt_oss_model: str
    gpt_oss_configured: bool
    gpt_oss_base_url: str
    pii_redaction: bool = True
    hallucination_filter: bool = True
    profanity_filter: bool = True
    escalate_low_confidence: bool = True
