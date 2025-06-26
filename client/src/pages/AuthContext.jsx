import React, {createContext, useState, useContext, useEffect} from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                username,
                password
            });
            
            const accessToken = response.data.access_token;
            const userData = response.data.user || { username };
            
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setToken(accessToken);
            setUser(userData);
            
            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Navigate to contacts page
            navigate('/contacts');
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/register`, 
                {
                    username,
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            if (response.status === 201) {
                // Store user data from registration response
                const userData = response.data.user || { username, email };
                
                // After successful registration, automatically log them in
                const loginSuccess = await login(username, password);
                return loginSuccess;
            } else {
                console.error('Registration failed:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            return false;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    }

    const isAuthenticated = () => {
        return !!token;
    }

    // Function to fetch user profile (if your backend supports it)
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`);
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If profile fetch fails, we can still work with stored user data
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Error parsing stored user data:', error);
                }
            }
            
            // Optionally fetch fresh user data from server
            // fetchUserProfile();
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user, 
            token, 
            isLoading,
            login, 
            register, 
            logout, 
            isAuthenticated,
            fetchUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}