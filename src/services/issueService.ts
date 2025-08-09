import { fetchJson } from './fetchJson';
import { API_BASE } from './index';
export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}

export const postIssue = async (issue: string) => {
  const res = await fetchJson<{ issueId?: string }>(`${API_BASE}/postIssue`, {
    method: 'POST',
    body: JSON.stringify({ descripcion: issue }),
  });
  if (res && typeof res === 'object' && 'status' in (res as any)) {
    const env = res as any;
    return {
      success: true,
      message: env.message ?? 'Issue reported successfully',
      data: env.data,
      ticketId: env.data?.issueId,
    } as IssueResponse;
  }
  return res as unknown as IssueResponse;
}; 