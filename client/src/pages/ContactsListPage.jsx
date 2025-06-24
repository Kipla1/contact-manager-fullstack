import React, { useEffect, useState } from 'react';
import AddContact from './AddContact';
import Searchbar from './Searchbar';
import ContactFilter from './ContactFilter';
import { MdModeEdit, MdDeleteForever, MdBlock } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import { TbLockOpen } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import ReactModal from 'react-modal';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL; // For Vite

ReactModal.setAppElement('#root');

function ContactsListPage() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");
    
    // Modal states
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [detailsModalIsOpen, setDetailsModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [currentContact, setCurrentContact] = useState(null);
    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        isFavorite: false,
        isBlocked: false
    });

    function openAddModal() {
        setAddModalIsOpen(true);
    }

    function closeAddModal() {
        setAddModalIsOpen(false);
    }

    function openDetailsModal(contact) {
        setCurrentContact(contact);
        setDetailsModalIsOpen(true);
    }

    function closeDetailsModal() {
        setDetailsModalIsOpen(false);
        setCurrentContact(null);
    }

    function openEditModal(contact) {
        setCurrentContact(contact);
        setEditFormData({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            isFavorite: contact.isFavorite,
            isBlocked: contact.isBlocked
        });
        setEditModalIsOpen(true);
    }

    function closeEditModal() {
        setEditModalIsOpen(false);
    }

    const handleAddContact = (newContact) => {
        setContacts(prevContacts => [...prevContacts, newContact]);
        if (activeFilter === "") {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        } else if (activeFilter === "favorite" && newContact.isFavorite) {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        } else if (activeFilter === "blocked" && newContact.isBlocked) {
            setFilteredContacts(prevFiltered => [...prevFiltered, newContact]);
        }
    };

    const handleEditClick = (contact) => {
        openEditModal(contact);
    };

    const handleContactClick = (contact) => {
        openDetailsModal(contact);
    };

    const handleEditFromDetails = () => {
        closeDetailsModal();
        openEditModal(currentContact);
    };

    const applyCurrentFilters = (contactsList) => {
        if (activeFilter === "") {
            setFilteredContacts(contactsList);
        } else if (activeFilter === "favorite") {
            const favorites = contactsList.filter(contact => contact.isFavorite === true || contact.isFavorite === "true");
            setFilteredContacts(favorites);
        } else if (activeFilter === "blocked") {
            const blocked = contactsList.filter(contact => contact.isBlocked === true || contact.isBlocked === "true");
            setFilteredContacts(blocked);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (deleteStatus) setDeleteStatus(null);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [deleteStatus]);

    useEffect(() => {
        fetch(`${API_URL}/contacts`)
        .then(res => res.json())
        .then(data => {
            setContacts(data);
            setFilteredContacts(data);
            setTimeout(() => setIsLoading(false), 1000);
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        setSearchedContacts(contacts);
    }, [contacts]);

    const filterUser = (filterType) => {
        setActiveFilter(filterType);
        if (filterType === "") {
            setFilteredContacts([...contacts]);
        } else if (filterType === "favorite") {
            const favorites = contacts.filter(contact => contact.isFavorite === true || contact.isFavorite === "true");
            setFilteredContacts(favorites);
        } else if (filterType === "blocked") {
            const blocked = contacts.filter(contact => contact.isBlocked === true || contact.isBlocked === "true");
            setFilteredContacts(blocked);
        }
    };

    const handleDelete = (contactId) => {
        fetch(`${API_URL}/contacts/${contactId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const updated = contacts.filter(c => c.id !== contactId);
                setContacts(updated);
                setFilteredContacts(updated);
                setDeleteStatus('success');
                
                if (currentContact && currentContact.id === contactId) {
                    closeDetailsModal();
                }
            } else {
                setDeleteStatus('error');
            }
        })
        .catch(() => setDeleteStatus('error'));
    };

    const handleToggleBlocked = (contactId, currentBlockedStatus) => {
        fetch(`${API_URL}/contacts/${contactId}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: !currentBlockedStatus })
        })
        .then(res => res.json())
        .then(updatedContact => {
            const updated = contacts.map(c => c.id === contactId ? updatedContact : c);
            setContacts(updated);
            applyCurrentFilters(updated);
            
            if (currentContact && currentContact.id === contactId) {
                setCurrentContact(updatedContact);
            }
        });
    };

    const handleToggleFavorite = async (contactId, currentFavoriteStatus) => {
        try {
            const response = await axios.patch(`${API_URL}/contacts/${contactId}`, {
                isFavorite: !currentFavoriteStatus,
            });
            
            const updatedContact = response.data;
            const updated = contacts.map(c => c.id === contactId ? updatedContact : c);
            setContacts(updated);
            applyCurrentFilters(updated);
            
            if (currentContact && currentContact.id === contactId) {
                setCurrentContact(updatedContact);
            }
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const onSearch = (value) => {
        if (value === "") return setSearchedContacts(contacts);
        setSearchedContacts(contacts.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
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
            const response = await axios.put(`${API_URL}/contacts/${editFormData.id}`, editFormData);
            const updatedContact = response.data;
            
            const updatedList = contacts.map(contact => 
                contact.id === updatedContact.id ? updatedContact : contact
            );
            
            setContacts(updatedList);
            applyCurrentFilters(updatedList);
            closeEditModal();
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    if (isLoading) return <h1 className="isloading">Loading...</h1>;

    const displayedContacts = activeFilter !== "" ? filteredContacts : searchedContacts;

    return (
        <>
        <div className="contact-list-container">
            <h1 className="contact-list-title">Contact List</h1>

            <div className="search-filter-container">
                <Searchbar onSearch={onSearch} />
                <ContactFilter filterUser={filterUser} activeFilter={activeFilter} />
                {activeFilter && (
                    <button onClick={() => filterUser("")} className="clear-filter-btn">
                        Clear Filter
                    </button>
                )}
            </div>

            <div className="contact-list-actions">
                <button className="add-contact-btn" onClick={openAddModal}>
                    Add New Contact
                </button>
            </div>

            {activeFilter && (
                <div className="filter-status">
                    Showing {activeFilter} contacts ({filteredContacts.length})
                </div>
            )}

            <div className="contact-list">
                {displayedContacts?.length > 0 ? (
                    displayedContacts.map(contact => (
                        <div key={contact.id} className="contact-card">
                            <div className="contact-info" onClick={() => handleContactClick(contact)} style={{ cursor: 'pointer' }}>
                                <h3>
                                    {contact.name}
                                    {contact.isFavorite && <FaStar className="favorite-icon" />}
                                    {contact.isBlocked && <MdBlock className='blocked' />}
                                </h3>
                                <p>Phone: {contact.phone}</p>
                                <p>Email: {contact.email}</p>
                            </div>
                            <div className="contact-actions">
                                <button className="edit-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(contact);
                                }}>
                                    <MdModeEdit />
                                </button>
                                <button 
                                    className='delete-btn' 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(contact.id);
                                    }}
                                >
                                    <MdDeleteForever />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleBlocked(contact.id, contact.isBlocked);
                                    }}
                                    className='block-btn'
                                    title={contact.isBlocked ? "Unblock Contact" : "Block Contact"}
                                >
                                    {contact.isBlocked ? <TbLockOpen /> : <GoBlocked />}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No {activeFilter} contacts found.</p>
                    </div>
                )}
            </div>
        </div>

        {deleteStatus && (
            <div className="notification-container">
                <div className={deleteStatus === 'success' ? 'contact-deleted' : 'contact-notDeleted'}>
                    <span>
                        {deleteStatus === 'success'
                            ? 'Contact deleted successfully'
                            : 'Failed to delete contact. Try again later.'}
                    </span>
                </div>
            </div>
        )}

        <ReactModal
            isOpen={addModalIsOpen}
            onRequestClose={closeAddModal}
            contentLabel="Add Contact"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <AddContact
                closeModal={closeAddModal}
                onAddContact={handleAddContact}
                existingContact={null}
            />
        </ReactModal>

        <ReactModal
            isOpen={detailsModalIsOpen}
            onRequestClose={closeDetailsModal}
            contentLabel="Contact Details"
            className="modal"
            overlayClassName="modal-overlay"
        >
            {currentContact && (
                <div>
                    <button className="modal-close-btn" onClick={closeDetailsModal}>
                        ×
                    </button>
                    <h2>Contact Details</h2>
                    <p><strong>Name:</strong> {currentContact.name}</p>
                    <p><strong>Email:</strong> {currentContact.email}</p>
                    <p><strong>Phone:</strong> {currentContact.phone}</p>
                    <p><strong>Favorite:</strong> {currentContact.isFavorite ? 'Yes' : 'No'}</p>
                    <p><strong>Blocked:</strong> {currentContact.isBlocked ? 'Yes' : 'No'}</p>
                    <div className="modal-actions">
                        <button 
                            className="favorite-btn" 
                            onClick={() => handleToggleFavorite(currentContact.id, currentContact.isFavorite)}
                        >
                            {currentContact.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </button>
                        <button 
                            className="block-btn" 
                            onClick={() => handleToggleBlocked(currentContact.id, currentContact.isBlocked)}
                        >
                            {currentContact.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button className="edit-btn" onClick={handleEditFromDetails}>Edit</button>
                    </div>
                </div>
            )}
        </ReactModal>

        <ReactModal
            isOpen={editModalIsOpen}
            onRequestClose={closeEditModal}
            contentLabel="Edit Contact"
            className="modal edit-modal"
            overlayClassName="modal-overlay"
        >
            <button className="modal-close-btn" onClick={closeEditModal}>
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
                    <button type="button" className="cancel-btn" onClick={closeEditModal}>Cancel</button>
                </div>
            </form>
        </ReactModal>
        </>
    );
}

export default ContactsListPage;