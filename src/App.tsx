import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import TreePage from './pages/TreePage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route path="/" element={<TreePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  );
}

export default App;

