import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();
const OwnerContext = createContext();
const CustomerContext = createContext();
const DoctorContext = createContext();

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

export const OwnerProvider = ({ children }) => {
    const [ownerDetail, setOwnerDetail] = useState(() => {
        const storedOwnerDetail = localStorage.getItem('ownerDetail');
        return storedOwnerDetail ? JSON.parse(storedOwnerDetail) : null;
    });

    const updateOwnerDetail = (newOwnerDetail) => {
        setOwnerDetail(newOwnerDetail);
        localStorage.setItem('ownerDetail', JSON.stringify(newOwnerDetail));
    };

    return (
        <OwnerContext.Provider value={{ ownerDetail, setOwnerDetail: updateOwnerDetail }}>
            {children}
        </OwnerContext.Provider>
    );
};

export const CustomerProvider = ({ children }) => {
    const [customerDetail, setCustomerDetail] = useState(() => {
        const storedCustomerDetail = localStorage.getItem('customerDetail');
        return storedCustomerDetail ? JSON.parse(storedCustomerDetail) : null;
    });

    const updateCustomerDetail = (newCustomerDetail) => {
        setCustomerDetail(newCustomerDetail);
        localStorage.setItem('customerDetail', JSON.stringify(newCustomerDetail));
    };

    return (
        <CustomerContext.Provider value={{ customerDetail, setCustomerDetail: updateCustomerDetail }}>
            {children}
        </CustomerContext.Provider>
    );
};

export const DoctorProvider = ({ children }) => {
    const [doctorDetail, setDoctorDetail] = useState(() => {
        const storedDoctorDetail = localStorage.getItem('doctorDetail');
        return storedDoctorDetail ? JSON.parse(storedDoctorDetail) : null;
    });

    const updateDoctorDetail = (newDoctorDetail) => {
        setDoctorDetail(newDoctorDetail);
        localStorage.setItem('doctorDetail', JSON.stringify(newDoctorDetail));
    };

    return (
        <DoctorContext.Provider value={{ doctorDetail, setDoctorDetail: updateDoctorDetail }}>
            {children}
        </DoctorContext.Provider>
    );
};


export const useAdmin = () => {
    return useContext(AdminContext);
};

export const useOwner = () => {
    return useContext(OwnerContext);
};

export const useCustomer = () => {
    return useContext(CustomerContext);
};

export const useDoctor = () => {
    return useContext(DoctorContext);
};
