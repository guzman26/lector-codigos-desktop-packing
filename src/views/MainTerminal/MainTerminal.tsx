import React from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import CommandInput from '../../components/CommandInput/CommandInput';
import { Link } from 'react-router-dom';
import { useCommandHandler } from '../../hooks/useCommandHandler';
import styles from './MainTerminal.module.css';

/**
 * MainTerminal is the single entry point for the "terminal" UI. It composes
 * the real-time Dashboard with a CommandInput so operators never have to
 * leave this screen.
 *
 * Clean Code rationale:
 * – Keeps render logic declarative and side-effect free.
 * – Delegates data retrieval and business logic to dedicated hooks.
 * – Keeps JSX minimal by extracting helper hooks and components.
 */
const MainTerminal: React.FC = () => {
  const { handleCommand, lastCommandResult } = useCommandHandler();

  return (
    <main className={styles.container}>
      <Dashboard />
      <CommandInput onSubmit={handleCommand} lastResult={lastCommandResult} />
      <Link to="/create-pallet" className={styles.createPalletBtn}>
        Crear Pallet
      </Link>
    </main>
  );
};

export default MainTerminal; 