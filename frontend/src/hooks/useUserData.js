import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.response?.data?.message || 'Failed to fetch user data');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = (updatedUser) => {
        setUser(updatedUser);
    };

    const clearUserData = () => {
        setUser(null);
        setError(null);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return {
        user,
        loading,
        error,
        fetchUserData,
        updateUserData,
        clearUserData
    };
};

export default useUserData;
