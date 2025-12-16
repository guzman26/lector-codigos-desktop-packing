import { fetchJson, isApiEnvelope } from './fetchJson';
import { API_BASE } from './index';
import type { ApiEnvelope } from '../types';

export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}

// Report issue - use consolidated /admin endpoint
export const postIssue = async (issue: string) => {
  const res = await fetchJson<ApiEnvelope<{ issueId: string }>>(`${API_BASE}/admin`, {
    method: 'POST',
    body: JSON.stringify({
      resource: 'issue',
      action: 'create',
      descripcion: issue
    }),
  });
  
  if (isApiEnvelope(res)) {
    const isSuccess = res.status === 'success';
    const data = res.data as { issueId: string } | undefined;
    return {
      success: isSuccess,
      message: isSuccess 
        ? (res.message || 'Issue reported successfully')
        : (res.message || 'Failed to report issue'),
      data: res.data,
      ticketId: data?.issueId,
    } as IssueResponse;
  }
  
  return {
    success: false,
    message: 'Failed to report issue',
  } as IssueResponse;
};
