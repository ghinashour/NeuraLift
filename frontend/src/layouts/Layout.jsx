import React from 'react';
import Sidebar from '../components/Sidebar';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    return (
        <Sidebar>
            {children}
        </Sidebar>
    );
};

export default Layout;
