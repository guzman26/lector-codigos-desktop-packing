import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainTerminal from './views/MainTerminal/MainTerminal';
import CreatePallet from './views/CreatePallet/CreatePallet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainTerminal />} />
        <Route path="/create-pallet" element={<CreatePallet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
