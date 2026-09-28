export interface TicketEntity {
  label: string;
  value: string;
}

export interface TicketDocument {
  name: string;
  source: string;
  rank: number;
  score: number;
  snippet: string;
}

export interface TicketResponse {
  content: string;
  model_used: string;
  confidence: number;
  groundedness: number;
  hallucination_risk: number;
  tone_score: number;
  created_at?: string;
}

export interface TicketEvaluation {
  faithfulness: number;
  answer_relevance: number;
  context_precision: number;
  context_recall: number;
  tone: number;
  safety: number;
  professionalism: number;
  hallucination_risk: number;
}

export interface TicketDetail {
  id: string;
  subject: string;
  message: string;
  category: string;
  subcategory: string;
  priority: string;
  sentiment: string;
  intent: string;
  confidence: number;
  status: string;
  requires_escalation: boolean;
  escalation_reason?: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  updated_at: string;
  entities: TicketEntity[];
  retrieved_docs: TicketDocument[];
  response?: TicketResponse;
  evaluation?: TicketEvaluation;
}

export interface TicketListItem {
  id: string;
  subject: string;
  category: string;
  priority: string;
  confidence: number;
  status: string;
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  name: string;
  source: string;
  category: string;
  chunk_count: number;
  snippet?: string;
  created_at: string;
}

export interface SystemSettings {
  active_provider: string;
  gemini_model: string;
  gemini_configured: boolean;
  gpt_oss_model: string;
  gpt_oss_configured: boolean;
  gpt_oss_base_url: string;
  pii_redaction: boolean;
  hallucination_filter: boolean;
  profanity_filter: boolean;
  escalate_low_confidence: boolean;
}

export interface AnalyticsData {
  total_tickets: number;
  resolved_tickets: number;
  escalated_tickets: number;
  avg_confidence: number;
  avg_response_time: string;
  csat: number;
  escalation_rate: string;
  categories: { name: string; value: number }[];
  sentiment: { name: string; v: number; fill: string }[];
}

export async function submitTicket(data: {
  message: string;
  subject?: string;
  customer_name?: string;
  customer_email?: string;
}): Promise<TicketDetail> {
  const res = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit ticket: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchTickets(): Promise<TicketListItem[]> {
  const res = await fetch("/api/tickets");
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function fetchLatestTicket(): Promise<TicketDetail> {
  const res = await fetch("/api/tickets/latest");
  if (!res.ok) throw new Error("Failed to fetch latest ticket");
  return res.json();
}

export async function fetchTicket(id: string): Promise<TicketDetail> {
  const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch ticket ${id}`);
  return res.json();
}

export async function regenerateAIResponse(id: string): Promise<TicketResponse> {
  const res = await fetch(`/api/tickets/${encodeURIComponent(id)}/regenerate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to regenerate response");
  return res.json();
}

export async function fetchDocuments(): Promise<KnowledgeDocument[]> {
  const res = await fetch("/api/documents");
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function uploadDocumentFile(file: File, category: string = "General") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const res = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function fetchEvaluationSummary(): Promise<TicketEvaluation> {
  const res = await fetch("/api/analytics/evaluation/summary");
  if (!res.ok) throw new Error("Failed to fetch evaluation summary");
  return res.json();
}

export async function fetchSettings(): Promise<SystemSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function switchActiveProvider(provider: "gemini" | "gpt_oss") {
  const res = await fetch("/api/settings/provider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider }),
  });
  return res.json();
}

// Active ticket ID state helper in localStorage
export function getActiveTicketId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("supportmind_active_ticket_id");
}

export function setActiveTicketId(id: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("supportmind_active_ticket_id", id);
  }
}
