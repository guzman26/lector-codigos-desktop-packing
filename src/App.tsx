import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTerminal from './views/MainTerminal/MainTerminal';
import CreatePallet from './views/CreatePallet/CreatePallet';
import OfflineSyncStatus from './components/OfflineSyncStatus/OfflineSyncStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTerminal />} />
        <Route path="/create-pallet" element={<CreatePallet />} />
      </Routes>
      <OfflineSyncStatus />
    </BrowserRouter>
  );
}

export default App
