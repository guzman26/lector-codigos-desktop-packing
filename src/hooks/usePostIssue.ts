import { useState } from 'react';
import { postIssue } from '../services/issueService';
import type { IssueResponse } from '../services/issueService';

export const usePostIssue = () => {
  const [response, setResponse] = useState<IssueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = async (issue: string) => {
    setLoading(true);
    try {
      const res = await postIssue(issue);
      setResponse(res);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, response, loading, error };
}; 