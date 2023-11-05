import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [adminDetail, setAdminDetail] = useState(() => {
        const storedAdminDetail = localStorage.getItem('adminDetail');
        return storedAdminDetail ? JSON.parse(storedAdminDetail) : null;
    });

    const updateAdminDetail = (newAdminDetail) => {
        setAdminDetail(newAdminDetail);
        localStorage.setItem('adminDetail', JSON.stringify(newAdminDetail));
    };

    return (
        <AdminContext.Provider value={{ adminDetail, setAdminDetail: updateAdminDetail }}>
            {children}
        </AdminContext.Provider>
    );
};


export const useAdmin = () => {
    return useContext(AdminContext);
};
