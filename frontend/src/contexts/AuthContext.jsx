import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data from localStorage or fetch from backend on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/user` , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.data;
                console.log("IN AUTHCONTEXT", data);
                setUser(data.user);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn('Unauthorized access - setting user to null');
                    setUser(null);
                    localStorage.removeItem('token');
                } else {
                    console.error('Error fetching user data:', error);
                }
                // setToken(null);
                // localStorage.removeItem('token');
                //   localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

