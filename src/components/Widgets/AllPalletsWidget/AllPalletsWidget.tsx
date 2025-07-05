import React from 'react';
import { useAllPallets } from '../../../hooks/useAllPallets';
import WidgetCard from '../WidgetCard';
import Modal from '../../Modal';
import { useState } from 'react';

const AllPalletsWidget: React.FC = () => {
  const { data, loading, error } = useAllPallets();
  const [open, setOpen] = useState(false);

  return (
    <>
    <WidgetCard title="All Pallets">
      <button
        type="button"
        className="self-end text-sm text-blue-400 hover:underline mb-2"
        onClick={() => setOpen(true)}
      >
        View all ({data.length})
      </button>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">{error.message}</p>}
      {!loading && !error && (
        <ul className="list-none space-y-1">
          {data.map((pallet) => (
            <li key={pallet.id}>{pallet.codigo}</li>
          ))}
        </ul>
      )}
    </WidgetCard>

    <Modal isOpen={open} onClose={() => setOpen(false)} title="All Pallets">
      <ul className="space-y-4">
        {data.map((pallet) => (
          <li
            key={pallet.id}
            className="border border-zinc-700 rounded p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-lg">{pallet.codigo}</span>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded">
                Placeholder Action
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(
              pallet,
              null,
              2
            )}</pre>
          </li>
        ))}
      </ul>
    </Modal>
    </>
  );
};

export default AllPalletsWidget; 