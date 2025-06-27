import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditContact() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_URL}/contacts/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load contact");
        return res.json();
      })
      .then((data) => {
        setContact(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const payload = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        is_favorite: contact.isFavorite,   // <-- snake_case
        is_blocked: contact.isBlocked      // <-- snake_case
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update contact");
      navigate("/contacts");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!contact) return null;

  return (
    <div className="edit-contact-page">
      <h2>Edit Contact</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={contact.name || ""}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={contact.email || ""}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="tel"
          name="phone"
          value={contact.phone || ""}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <label>
          <input
            type="checkbox"
            name="isFavorite"
            checked={!!contact.isFavorite}
            onChange={handleChange}
          />
          Favorite
        </label>
        <label>
          <input
            type="checkbox"
            name="isBlocked"
            checked={!!contact.isBlocked}
            onChange={handleChange}
          />
          Blocked
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={() => navigate("/contacts")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditContact;