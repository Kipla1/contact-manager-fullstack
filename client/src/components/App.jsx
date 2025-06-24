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
import { AuthProvider } from '../pages/AuthContext'; // adjust path if needed
import Register from "../pages/Register";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/contacts" element={<ContactsListPage />} />
          <Route path="/contacts/:id" element={<ContactDetails />} />
          <Route path="/add" element={<AddContact />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
