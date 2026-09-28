from fastapi import APIRouter
from typing import Dict, Any
from ..config import settings
from ..schemas import SystemSettingsSchema
from ..services.gemini_provider import GeminiProvider
from ..services.gpt_oss_provider import GptOssProvider

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("", response_model=SystemSettingsSchema)
def get_settings():
    """Returns current active AI configurations and provider statuses."""
    gemini = GeminiProvider()
    gpt_oss = GptOssProvider()

    return {
        "active_provider": settings.ACTIVE_LLM_PROVIDER,
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_configured": gemini.is_configured(),
        "gpt_oss_model": settings.GPT_OSS_MODEL,
        "gpt_oss_configured": gpt_oss.is_configured(),
        "gpt_oss_base_url": settings.GPT_OSS_BASE_URL,
        "pii_redaction": True,
        "hallucination_filter": True,
        "profanity_filter": True,
        "escalate_low_confidence": True,
    }

@router.post("/provider")
def update_active_provider(payload: Dict[str, str]):
    """Switches active provider between 'gemini' and 'gpt_oss'."""
    new_provider = payload.get("provider")
    if new_provider in ["gemini", "gpt_oss"]:
        settings.ACTIVE_LLM_PROVIDER = new_provider
        return {"status": "success", "active_provider": settings.ACTIVE_LLM_PROVIDER}
    return {"status": "error", "message": "Invalid provider"}
