import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../pages/Navbar";
import Login from "../pages/Login";
import ContactDetails from "../pages/ContactDetails";
import ContactsListPage from "../pages/ContactsListPage";
import AddContact from "../pages/AddContact";
import React from "react";
import { AuthProvider, useAuth } from '../pages/AuthContext';
import Register from "../pages/Register";
import ProtectedRoute from "../pages/ProtectedRoute";

// Component to handle default route logic
function DefaultRoute() {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated() ? 
    <Navigate to="/contacts" replace /> : 
    <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/contacts" element={
            <ProtectedRoute>
              <ContactsListPage />
            </ProtectedRoute>
          } />
          <Route path="/contacts/:id" element={
            <ProtectedRoute>
              <ContactDetails />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <AddContact />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;