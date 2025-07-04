import { useState } from 'react';

interface UseCommandHandlerReturn {
  handleCommand: (cmd: string) => void;
  lastCommandResult: string | null;
}

/**
 * Stubbed hook that will eventually communicate with backend/serial interface.
 */
export const useCommandHandler = (): UseCommandHandlerReturn => {
  const [lastCommandResult, setLastCommandResult] = useState<string | null>(null);

  const handleCommand = (cmd: string) => {
    // TODO: send command to server and await response
    setLastCommandResult(`Executed: ${cmd}`);
  };

  return { handleCommand, lastCommandResult };
}; 