import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AddContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (addStatus === 'success') {
      timeoutId = setTimeout(() => {
        navigate('/'); // Redirect to home or contacts list after success
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [addStatus, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAdding(true);

    const newContact = {
      name,
      email,
      phone,
      isFavorite,
      isBlocked
    };

    const token = localStorage.getItem('token');

    fetch(`${import.meta.env.VITE_API_URL}/add`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newContact)
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data, "Added successfully");
      setName('');
      setEmail('');
      setPhone('');
      setIsFavorite(false);
      setIsBlocked(false);
      setIsAdding(false);
      setAddStatus('success');
    })
    .catch(err => {
      console.log(err);
      setIsAdding(false);
      setAddStatus('error');
    });
  }

  return (
    <div className="add-contact-page">
      <form className='add-contact' onSubmit={handleSubmit}>
        <h1>Add New Contact</h1>
        <input 
          className='new-contact' 
          type="text" 
          placeholder='Enter Name' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <input  
          className='new-contact' 
          type="email" 
          placeholder='Enter email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input  
          className='new-contact' 
          type="tel" 
          placeholder='Enter Phone number ' 
          maxLength={10} 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required
        />
        
        <button 
          type="button" 
          onClick={() => setIsFavorite(!isFavorite)}
          className={isFavorite ? 'favorite-active' : 'favorite-notActive'}
        >
          {isFavorite ? 'Remove as favorite ★' : 'Set as Favorite ☆'}
        </button>
        
        <button 
          type="submit" 
          className='submit-contact' 
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : 'Add Contact'}
        </button>
      </form>
      
      {addStatus && (
        <div className="notification-container">
          <div className={addStatus === 'success' ? 'contact-added' : 'contact-notAdded'}>
            <span>
              {addStatus === 'success' 
                ? 'Contact added successfully' 
                : 'Failed to add contact. Try again later.'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddContact