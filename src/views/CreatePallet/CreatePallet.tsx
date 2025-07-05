import React from 'react';
import { Link } from 'react-router-dom';
import CreatePalletForm from '../../components/Forms/CreatePalletForm';

const CreatePallet: React.FC = () => (
  <div className="p-4 flex flex-col gap-4 min-h-screen">
    <header className="flex justify-between items-center mb-4">
      <h1>Crear Pallet</h1>
      <Link to="/" className="text-blue-400 hover:underline">
        ← Volver al Terminal
      </Link>
    </header>
    <CreatePalletForm />
  </div>
);

export default CreatePallet; 