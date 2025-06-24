import React, {createContext, useState, useContext, useEffect} from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const navigate = useNavigate()

    const login = async (username, password) =>{
        try{
            const response =await axios.post('http://127.0.0.1:5000/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.access_token)
            setToken(response.data.access_token)
            navigate('/contacts')
            return true
        } catch (error) {
            console.error('Login failed:', error)
            return false
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
                }
            }
        );
        return true;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
}

    const logout = () =>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        navigate('/login')
    }

    useEffect(()=>{
        if (token){
            // defaul authorization header for all requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // fetch user details 
            // fetchUserDetails
        }
        else{
            delete axios.defaults.headers.common['Authorization']
        }
    }, [token])

    return (
        <AuthContext.Provider value={{user, token, login, register, logout}}>{children}</AuthContext.Provider>
    )
}

export  function useAuth(){
    return useContext(AuthContext)
}