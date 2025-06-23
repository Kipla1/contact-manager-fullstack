import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isFavorite: false,
    isBlocked: false
  });

  useEffect(() => {
    fetchContact();
  }, [id]);

  useEffect(() => {
    if (contact) {
      setEditFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        isFavorite: contact.isFavorite,
        isBlocked: contact.isBlocked
      });
    }
  }, [contact]);

  const fetchContact = async () => {
    try {
      const response = await axios.get(`https://contact-manager-server-lyart.vercel.app/contacts/${id}`);
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching contact:', error);
    }
  };

  const handleToggleFavorite = async () => {
    const updated = { ...contact, isFavorite: !contact.isFavorite };
    await axios.patch(`https://contact-manager-server-lyart.vercel.app/contacts/${id}`, {
      isFavorite: !contact.isFavorite,
    });
    setContact(updated);
  };

  const handleToggleBlock = async () => {
    const updated = { ...contact, isBlocked: !contact.isBlocked };
    await axios.patch(`https://contact-manager-server-lyart.vercel.app/contacts/${id}`, {
      isBlocked: !contact.isBlocked,
    });
    setContact(updated);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (contact) {
      setEditFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        isFavorite: contact.isFavorite,
        isBlocked: contact.isBlocked
      });
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://contact-manager-server-lyart.vercel.app/contacts/${id}`, editFormData);
      setContact(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <div className="modal-overlay">
      {isEditing ? (
        <div className="modal edit-modal">
          <button className="modal-close-btn" onClick={handleCancelEdit}>
            ×
          </button>
          <h2>Edit Contact</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group checkbox">
              <label htmlFor="isFavorite">
                <input
                  type="checkbox"
                  id="isFavorite"
                  name="isFavorite"
                  checked={editFormData.isFavorite}
                  onChange={handleEditFormChange}
                />
                Mark as favorite
              </label>
            </div>
            
            <div className="form-group checkbox">
              <label htmlFor="isBlocked">
                <input
                  type="checkbox"
                  id="isBlocked"
                  name="isBlocked"
                  checked={editFormData.isBlocked}
                  onChange={handleEditFormChange}
                />
                Block contact
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="modal">
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
          <h2>Contact Details</h2>
          <p><strong>Name:</strong> {contact.name}</p>
          <p><strong>Email:</strong> {contact.email}</p>
          <p><strong>Phone:</strong> {contact.phone}</p>
          <p><strong>Favorite:</strong> {contact.isFavorite ? 'Yes' : 'No'}</p>
          <p><strong>Blocked:</strong> {contact.isBlocked ? 'Yes' : 'No'}</p>
          <div className="modal-actions">
            <button className="favorite-btn" onClick={handleToggleFavorite}>
              {contact.isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
            <button className="block-btn" onClick={handleToggleBlock}>
              {contact.isBlocked ? 'Unblock' : 'Block'}
            </button>
            <button className="edit-btn" onClick={handleEditClick}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactDetails;