from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Ticket, TicketResponse
from ..schemas import TicketCreate, TicketDetailSchema, TicketListItemSchema, TicketResponseSchema
from ..services.pipeline import ticket_pipeline
from ..services.factory import get_llm_provider
from ..services.rag_service import rag_service
from ..services.guardrails_service import guardrails_service

router = APIRouter(prefix="/api/tickets", tags=["Tickets"])

@router.post("", response_model=TicketDetailSchema)
async def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db),
):
    """
    Submits a new customer support ticket through the entire AI pipeline:
    Classification -> RAG Retrieval -> Grounded Generation -> Guardrails -> Evaluation -> DB.
    """
    ticket = await ticket_pipeline.process_ticket(
        message=payload.message,
        subject=payload.subject,
        customer_name=payload.customer_name or "Alex Stone",
        customer_email=payload.customer_email or "customer@example.com",
        db=db,
    )
    return ticket

@router.get("", response_model=List[TicketListItemSchema])
def list_tickets(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Lists all support tickets sorted by latest first."""
    tickets = db.query(Ticket).order_by(Ticket.created_at.desc()).offset(skip).limit(limit).all()
    return tickets

@router.get("/latest", response_model=TicketDetailSchema)
def get_latest_ticket(db: Session = Depends(get_db)):
    """Fetches the most recently processed ticket."""
    ticket = db.query(Ticket).order_by(Ticket.created_at.desc()).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="No tickets found.")
    return ticket

@router.get("/{ticket_id}", response_model=TicketDetailSchema)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Retrieves full details, analysis, retrieved docs, AI response, and evaluations for a ticket."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found.")
    return ticket

@router.post("/{ticket_id}/regenerate", response_model=TicketResponseSchema)
async def regenerate_response(ticket_id: str, db: Session = Depends(get_db)):
    """Regenerates the AI response for an existing ticket using fresh RAG retrieval."""
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")

    llm = get_llm_provider()
    retrieved = await rag_service.retrieve(ticket.message, top_k=4)
    context_str = "\n\n".join([f"[{d['name']}]: {d.get('full_text', d['snippet'])}" for d in retrieved])

    prompt = (
        f"Customer Message:\n{ticket.message}\n\n"
        f"Knowledge Base Context:\n{context_str}\n\n"
        "Regenerate a polished, empathetic, enterprise-grade response strictly grounded in context.\n"
        "Sign off as:\nBest regards,\nSupportMind AI"
    )

    content = await llm.generate(prompt=prompt, temperature=0.4)
    groundedness, risk = guardrails_service.evaluate_grounding(content, [d.get("full_text", d["snippet"]) for d in retrieved])

    resp = db.query(TicketResponse).filter(TicketResponse.ticket_id == ticket_id).first()
    if resp:
        resp.content = content
        resp.model_used = llm.model_name
        resp.groundedness = groundedness
        resp.hallucination_risk = risk
    else:
        resp = TicketResponse(
            ticket_id=ticket.id,
            content=content,
            model_used=llm.model_name,
            groundedness=groundedness,
            hallucination_risk=risk,
        )
        db.add(resp)

    db.commit()
    db.refresh(resp)
    return resp
