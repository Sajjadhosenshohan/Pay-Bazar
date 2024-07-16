/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(user)

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const setUserAndStore = (userInfo) => {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
    };

    const authInfo = {
        user,
        setUser: setUserAndStore,
        loading,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
