import React from 'react';
import { useUnassignedBoxesInPacking } from '../../../hooks/useUnassignedBoxesInPacking';
import styles from './UnassignedBoxesWidget.module.css';
import WidgetCard from '../WidgetCard';
import Modal from '../../Modal';
import { useState } from 'react';

const UnassignedBoxesWidget: React.FC = () => {
  const { data, loading, error } = useUnassignedBoxesInPacking();
  const [open, setOpen] = useState(false);

  return (
    <>
    <WidgetCard title="Unassigned Boxes (Packing)">
      <button
        type="button"
        className="self-end text-sm text-blue-400 hover:underline mb-2"
        onClick={() => setOpen(true)}
      >
        View all ({data.length})
      </button>
      {loading && <p>Loading…</p>}
      {error && <p className={styles.error}>{error.message}</p>}
      {!loading && !error && (
        <ul className={styles.list}>
          {data.map((box) => (
            <li key={box.codigo}>{box.codigo}</li>
          ))}
        </ul>
      )}
    </WidgetCard>

    <Modal isOpen={open} onClose={() => setOpen(false)} title="Unassigned Boxes">
      <ul className="space-y-4">
        {data.map((box) => (
          <li
            key={box.codigo}
            className="border border-zinc-700 rounded p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-lg">{box.codigo}</span>
              <button className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded">
                Placeholder Action
              </button>
            </div>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(
              box,
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

export default UnassignedBoxesWidget; 