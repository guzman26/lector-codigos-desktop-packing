import { fetchJson } from './fetchJson';

export interface IssueResponse {
  success: boolean;
  message: string;
  data?: unknown;
  ticketId?: string;
}

const API_BASE = '/api';

export const postIssue = (issue: string) =>
  fetchJson<IssueResponse>(`${API_BASE}/issues`, {
    method: 'POST',
    body: JSON.stringify({ issue }),
  }); 