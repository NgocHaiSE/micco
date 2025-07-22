import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/MainLayout';
import { AuthProvider, ProtectedRoute } from '@/context/AuthContext';

import ChatApp from '@/pages/ChatApp';
import DocumentsPage from '@/pages/Documents';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ResetPassword from '@/pages/auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
            } />  
          <Route path="/documents" element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
            } />
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;