import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import ReservationList from './pages/ReservationList';
import CreateReservationForm from './pages/CreateReservationForm';
import Dashboard from './pages/Dashboard';
import Navbar from './pages/Navbar';
import ProtectedRoute from './pages/ProtectedRoute';
import UserManagement from './pages/admin/UserManagement';
import RoomManagement from './pages/admin/RoomManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
                <div className="min-h-screen bg-gray-100">
        <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/" element={
                            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                                <>
                                    <Navbar />
                                    <Dashboard />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                                <>
                                    <Navbar />
                                    <Dashboard />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/my-reservations" element={
                            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                                <>
                                    <Navbar />
                                    <ReservationList />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/reservations/create" element={
                            <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                                <>
                                    <Navbar />
                                    <CreateReservationForm />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/users" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <>
                                    <Navbar />
                                    <UserManagement />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/rooms" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <>
                                    <Navbar />
                                    <RoomManagement />
                                </>
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/reservations" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <>
                                    <Navbar />
                                    <ReservationManagement />
                                </>
                            </ProtectedRoute>
                        } />
        </Routes>
                </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
