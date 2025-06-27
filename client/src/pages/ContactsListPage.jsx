import React, { useEffect, useState } from 'react';
import AddContact from './AddContact';
import Searchbar from './Searchbar';
import ContactFilter from './ContactFilter';
import { MdModeEdit, MdDeleteForever, MdBlock } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import { TbLockOpen } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL; // For Vite

function ContactsListPage() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchedContacts, setSearchedContacts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("");

    const handleContactClick = (contact) => {
        navigate(`/contacts/${contact.id}/edit`);
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
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/contacts`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 401) {
              // Token is missing or expired, redirect to login
              navigate('/login');
              return [];
            }
            return res.json();
          })
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
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/contacts/${contactId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                const updated = contacts.filter(c => c.id !== contactId);
                setContacts(updated);
                setFilteredContacts(updated);
                setDeleteStatus('success');
            } else {
                setDeleteStatus('error');
            }
        })
        .catch(() => setDeleteStatus('error'));
    };

    const handleToggleBlocked = (contactId, currentBlockedStatus) => {
        const token = localStorage.getItem('token');
        fetch(`${API_URL}/contacts/${contactId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ is_blocked: !currentBlockedStatus }) // <-- snake_case key
        })
        .then(res => res.json())
        .then(updatedContact => {
            const updated = contacts.map(c => c.id === contactId ? updatedContact : c);
            setContacts(updated);
            applyCurrentFilters(updated);
        });
    };

    const handleToggleFavorite = async (contactId, currentFavoriteStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${API_URL}/contacts/${contactId}`,
                { is_favorite: !currentFavoriteStatus }, // <-- snake_case key
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            const updatedContact = response.data;
            const updated = contacts.map(c => c.id === contactId ? updatedContact : c);
            setContacts(updated);
            applyCurrentFilters(updated);
        } catch (error) {
            console.error('Error updating favorite status:', error);
        }
    };

    const onSearch = (value) => {
        if (value === "") return setSearchedContacts(contacts);
        setSearchedContacts(contacts.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
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
                <button
                    className="add-contact-btn"
                    onClick={() => navigate('/add')}
                >
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
                            <div
                                className="contact-info"
                                onClick={() => handleContactClick(contact)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>
                                    {contact.name}
                                    {contact.isFavorite && <FaStar className="favorite-icon" />}
                                    {/* Blocked/Unblocked icon */}
                                    <span
                                      title={contact.isBlocked ? "Blocked (click to unblock)" : "Not blocked (click to block)"}
                                      style={{ marginLeft: 8, cursor: "pointer", color: contact.isBlocked ? "red" : "gray" }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleToggleBlocked(contact.id, contact.isBlocked);
                                      }}
                                    >
                                      {contact.isBlocked ? <MdBlock /> : <TbLockOpen />}
                                    </span>
                                </h3>
                                <p>Phone: {contact.phone}</p>
                                <p>Email: {contact.email}</p>
                            </div>
                            <div className="contact-actions">
                                <button className="edit-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/contacts/${contact.id}/edit`);
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
        </>
    );
}

export default ContactsListPage;