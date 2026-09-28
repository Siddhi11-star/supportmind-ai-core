from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
import io
import pypdf
from ..services.rag_service import rag_service
from ..schemas import DocumentSchema

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentSchema])
def list_documents():
    """Lists all documents indexed in the RAG knowledge base."""
    docs = rag_service.get_all_documents()
    res = []
    for d in docs:
        res.append({
            "id": d["id"],
            "name": d["name"],
            "source": d["source"],
            "category": d.get("category", "General"),
            "chunk_count": len(rag_service._chunk_text(d["content"])),
            "snippet": d["content"][:240] + ("..." if len(d["content"]) > 240 else ""),
            "created_at": "2026-09-28T00:00:00Z",
        })
    return res

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General"),
):
    """
    Uploads a PDF, Markdown, or TXT file into the RAG knowledge base,
    extracts the text, chunks it, and indexes it for semantic retrieval.
    """
    filename = file.filename or "uploaded_doc.txt"
    content_bytes = await file.read()
    
    extracted_text = ""
    if filename.lower().endswith(".pdf"):
        try:
            pdf_reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() or ""
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {e}")
    else:
        # Markdown / TXT
        try:
            extracted_text = content_bytes.decode("utf-8")
        except UnicodeDecodeError:
            extracted_text = content_bytes.decode("latin-1", errors="ignore")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Document contains no readable text.")

    doc_name = filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()
    doc = rag_service.add_document(
        name=doc_name,
        source=f"uploads/{filename}",
        category=category,
        content=extracted_text,
    )

    return {
        "status": "success",
        "message": f"Successfully indexed '{filename}' into RAG knowledge base.",
        "document": doc,
    }
