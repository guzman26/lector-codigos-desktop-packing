import { fetchJson, isApiEnvelope } from './fetchJson';
import { API_BASE } from './index';
export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}

interface PostIssueData { issueId?: string }

export const postIssue = async (issue: string) => {
  const res = await fetchJson<PostIssueData>(`${API_BASE}/postIssue`, {
    method: 'POST',
    body: JSON.stringify({ descripcion: issue }),
  });
  if (isApiEnvelope<PostIssueData>(res)) {
    return {
      success: true,
      message: res.message ?? 'Issue reported successfully',
      data: res.data,
      ticketId: res.data?.issueId,
    } as IssueResponse;
  }
  return res as unknown as IssueResponse;
};
