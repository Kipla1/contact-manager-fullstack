import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Intro from "./pages/Intro";
import ContactDetails from "./pages/ContactDetails";
import ContactsListPage from "./pages/ContactsListPage";
import AddContact from "./pages/AddContact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// PrivateRoute: block access if not logged in
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <ContactsListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts/:id"
          element={
            <PrivateRoute>
              <ContactDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddContact />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
