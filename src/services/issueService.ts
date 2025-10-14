import { fetchJson } from './fetchJson';
import { API_BASE } from './index';
export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}

// Report issue - use consolidated /admin endpoint
export const postIssue = async (issue: string) => {
  interface ConsolidatedResponse<T> {
    success: boolean;
    data?: T;
    error?: { code: string; message: string };
  }
  
  const res = await fetchJson<ConsolidatedResponse<{ issueId: string }>>(`${API_BASE}/admin`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'issue',
      action: 'create',
      descripcion: issue
    }),
  });
  
  if (res && typeof res === 'object' && 'success' in res) {
    return {
      success: res.success || false,
      message: res.success ? 'Issue reported successfully' : (res.error?.message || 'Failed to report issue'),
      data: res.data,
      ticketId: res.data?.issueId,
    } as IssueResponse;
  }
  
  return {
    success: false,
    message: 'Failed to report issue',
  } as IssueResponse;
};
