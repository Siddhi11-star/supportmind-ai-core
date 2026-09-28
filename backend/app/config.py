from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Locate backend root
BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "SupportMind AI Core"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Primary Cloud LLM Provider: Google Gemini
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"
    GEMINI_EMBEDDING_MODEL: str = "text-embedding-004"
    
    # Open-Model Cloud Alternative: GPT-OSS (e.g. Groq or OpenAI-compatible)
    GPT_OSS_API_KEY: Optional[str] = None
    GPT_OSS_BASE_URL: str = "https://api.groq.com/openai/v1"
    GPT_OSS_MODEL: str = "openai/gpt-oss-20b"
    
    # Active LLM Provider preference: "gemini" or "gpt_oss"
    ACTIVE_LLM_PROVIDER: str = "gemini"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BACKEND_DIR / 'supportmind.db'}"
    
    # Knowledge Base storage
    DOCS_DIR: str = str(BACKEND_DIR / "uploaded_docs")
    
    # Guardrails threshold
    LOW_CONFIDENCE_THRESHOLD: float = 0.75
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
