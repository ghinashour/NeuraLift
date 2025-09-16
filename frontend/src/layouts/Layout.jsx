import React from 'react';
import Sidebar from '../components/Sidebar';
import FloatingLogo from '../components/FloatingLogo';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    return (
        <Sidebar>
            {children}
            <FloatingLogo />
        </Sidebar>
    );
};

export default Layout;
