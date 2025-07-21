import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/MainLayout';
import { AuthProvider, ProtectedRoute } from '@/context/AuthContext';

import ChatApp from '@/pages/ChatApp';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/SignUp';
import ResetPassword from '@/pages/auth/ResetPassword';

// Use a direct path to the worker from node_modules

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
          <Route path="*" element={<div className="p-8 text-center">Page Not Found</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
