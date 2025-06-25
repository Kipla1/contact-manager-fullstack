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
            localStorage.setItem('token', accessToken);
            setToken(accessToken);
            
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
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    }

    const isAuthenticated = () => {
        return !!token;
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            // You could fetch user details here if needed
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
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}