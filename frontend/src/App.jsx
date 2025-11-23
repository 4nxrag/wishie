import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Today from './pages/Today';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import CreateEvent from './pages/CreateEvent';
import WishGenerator from './pages/WishGenerator';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/today" replace />} />
            <Route path="today" element={<Today />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="contacts/:id" element={<ContactDetail />} />
            <Route path="events/create/:contactId" element={<CreateEvent />} />
            <Route path="wish/:eventId" element={<WishGenerator />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
