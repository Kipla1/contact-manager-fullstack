import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // or process.env.REACT_APP_API_URL

axios.get(`${API_URL}/api/contacts`)
  .then(() => {
    // handle data
  })
  .catch(() => {
    // handle error
  });