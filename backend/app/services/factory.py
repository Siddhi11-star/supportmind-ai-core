import logging
from typing import Optional
from .llm_provider import LLMProvider
from .gemini_provider import GeminiProvider
from .gpt_oss_provider import GptOssProvider
from .mock_provider import MockFallbackProvider
from ..config import settings

logger = logging.getLogger(__name__)

def get_llm_provider(force_provider: Optional[str] = None) -> LLMProvider:
    """
    Factory function to obtain the configured cloud LLM provider.
    Priority:
    1. Gemini API (Primary cloud LLM)
    2. Hosted GPT-OSS (Groq / OpenAI-compatible alternative)
    3. MockFallbackProvider (if neither key is configured)
    """
    target = force_provider or settings.ACTIVE_LLM_PROVIDER

    if target == "gemini":
        gemini = GeminiProvider()
        if gemini.is_configured():
            return gemini
        logger.warning("Gemini requested but GEMINI_API_KEY is missing. Checking fallback...")

    if target == "gpt_oss" or target == "gemini":
        gpt_oss = GptOssProvider()
        if gpt_oss.is_configured():
            return gpt_oss
        if target == "gpt_oss":
            logger.warning("GPT_OSS requested but GPT_OSS_API_KEY is missing. Falling back...")

    # If Gemini is configured, use it even if active was not gemini
    gemini = GeminiProvider()
    if gemini.is_configured():
        return gemini

    logger.info("Using MockFallbackProvider (No cloud API key configured). Set GEMINI_API_KEY in .env to activate Gemini.")
    return MockFallbackProvider()
