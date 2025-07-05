import { fetchJson } from './fetchJson';
import { API_BASE } from './index';
export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}


export const postIssue = (issue: string) =>
  fetchJson<IssueResponse>(`${API_BASE}/postIssue`, {
    method: 'POST',
    body: JSON.stringify({ descripcion: issue }),
  }); 