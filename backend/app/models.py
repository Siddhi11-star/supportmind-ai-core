from sqlalchemy import Column, String, Integer, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from .database import Base

def generate_ticket_id():
    return f"#T-{str(uuid.uuid4().int)[:6]}"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(String(32), primary_key=True, default=generate_ticket_id)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    # AI Classification
    category = Column(String(64), default="General")
    subcategory = Column(String(64), default="General Inquiry")
    priority = Column(String(32), default="Medium")
    sentiment = Column(String(32), default="Neutral")
    intent = Column(String(128), default="Inquiry")
    confidence = Column(Float, default=0.90)
    
    # Status
    status = Column(String(32), default="Open")  # Open, Resolved, Escalated
    requires_escalation = Column(Boolean, default=False)
    escalation_reason = Column(Text, nullable=True)
    
    # Metadata
    customer_name = Column(String(128), default="Customer")
    customer_email = Column(String(128), default="customer@example.com")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    entities = relationship("TicketEntity", back_populates="ticket", cascade="all, delete-orphan")
    retrieved_docs = relationship("TicketDocument", back_populates="ticket", cascade="all, delete-orphan")
    response = relationship("TicketResponse", back_populates="ticket", uselist=False, cascade="all, delete-orphan")
    evaluation = relationship("TicketEvaluation", back_populates="ticket", uselist=False, cascade="all, delete-orphan")


class TicketEntity(Base):
    __tablename__ = "ticket_entities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String(32), ForeignKey("tickets.id"))
    label = Column(String(64), nullable=False)
    value = Column(String(255), nullable=False)

    ticket = relationship("Ticket", back_populates="entities")


class TicketDocument(Base):
    __tablename__ = "ticket_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String(32), ForeignKey("tickets.id"))
    name = Column(String(255), nullable=False)
    source = Column(String(255), nullable=False)
    rank = Column(Integer, default=1)
    score = Column(Float, default=0.85)
    snippet = Column(Text, nullable=False)

    ticket = relationship("Ticket", back_populates="retrieved_docs")


class TicketResponse(Base):
    __tablename__ = "ticket_responses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String(32), ForeignKey("tickets.id"), unique=True)
    content = Column(Text, nullable=False)
    model_used = Column(String(64), default="gemini-2.0-flash")
    confidence = Column(Float, default=95.0)
    groundedness = Column(Float, default=94.0)
    hallucination_risk = Column(Float, default=4.0)
    tone_score = Column(Float, default=92.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    ticket = relationship("Ticket", back_populates="response")


class TicketEvaluation(Base):
    __tablename__ = "ticket_evaluations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticket_id = Column(String(32), ForeignKey("tickets.id"), unique=True)
    faithfulness = Column(Float, default=95.0)
    answer_relevance = Column(Float, default=93.0)
    context_precision = Column(Float, default=91.0)
    context_recall = Column(Float, default=88.0)
    tone = Column(Float, default=92.0)
    safety = Column(Float, default=99.0)
    professionalism = Column(Float, default=95.0)
    hallucination_risk = Column(Float, default=4.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    ticket = relationship("Ticket", back_populates="evaluation")


class Document(Base):
    __tablename__ = "knowledge_documents"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    source = Column(String(255), nullable=False)
    category = Column(String(64), default="General")
    content = Column(Text, nullable=False)
    chunk_count = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String(64), primary_key=True)
    value = Column(Text, nullable=False)
