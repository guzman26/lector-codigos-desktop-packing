import React from 'react';
import { Link } from 'react-router-dom';
import CreatePalletForm from '../../components/Forms/CreatePalletForm';
import styles from './CreatePallet.module.css';

const CreatePallet: React.FC = () => (
  <div className={styles.container}>
    <header className={styles.header}>
      <h1>Crear Pallet</h1>
      <Link to="/" className={styles.back}>
        ← Volver al Terminal
      </Link>
    </header>
    <CreatePalletForm />
  </div>
);

export default CreatePallet; 