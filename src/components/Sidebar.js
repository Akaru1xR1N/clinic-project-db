import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Sidebar() {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isCustomer, setIsCustomer] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const isAdminUser = localStorage.getItem('isAdmin');
        setIsAdmin(isAdminUser === 'true');

        const isOwnerUser = localStorage.getItem('isOwner');
        setIsOwner(isOwnerUser === 'true');

        const isCustomerUser = localStorage.getItem('isCustomer');
        setIsCustomer(isCustomerUser === 'true');

        const isDoctorUser = localStorage.getItem('isDoctor');
        setIsDoctor(isDoctorUser === 'true');
    }, []);

    const isAdminActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const isOwnerActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const isCustomerActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const isDoctorActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const ToOwnerHome = () => {
        if (isAdmin) {
            window.location.href = '/admin/Home';
        }
        if (isOwner) {
            window.location.href = '/owner/Home';
        }
        if (isCustomer) {
            window.location.href = '/customer/Home';
        }
        if (isDoctor) {
            window.location.href = '/doctor/Home';
        }
    };

    const ToServicePage = () => {
        if (isAdmin) {
            window.location.href = '/admin/service';
        }
        if (isOwner) {
            window.location.href = '/owner/service';
        }
    };

    const ToUserManagement = () => {
        if (isAdmin) {
            window.location.href = '/admin/user/management';
        }
        if (isOwner) {
            window.location.href = '/owner/user/management';
        }
    };

    const ToOrderPage = () => {
        if (isAdmin) {
            window.location.href = '/admin/order';
        }
        if (isOwner) {
            window.location.href = '/owner/order';
        }
    };

    const ToStoragePage = () => {
        if (isAdmin) {
            window.location.href = '/admin/storage';
        }
        if (isOwner) {
            window.location.href = '/owner/storage';
        }
        if (isDoctor) {
            window.location.href = '/doctor/storage';
        }
    };

    const ToRequestPage = () => {
        window.location.href = '/customer/service/request';
    };

    const ToRegisteredPage = () => {
        window.location.href = '/customer/service';
    };

    const ToHistoryPage = () => {
        if (isCustomer) {
            window.location.href = '/customer/service/history';
        }
        if (isDoctor) {
            window.location.href = '/doctor/service/history';
        }
    };

    const ToTimeTable = () => {
        window.location.href = '/doctor/time/table';
    };

    const ToAccountPage = () => {
        if (isDoctor) {
            window.location.href = '/doctor/account'
        }
        if (isCustomer) {
            window.location.href = '/customer/account'
        }
        if (isOwner) {
            window.location.href = '/owner/account'
        }
        if (isAdmin) {
            window.location.href = '/admin/account'
        }
    };

    const ToLogout = () => {
        if (isDoctor) {
            window.location.href = '/doctor/login';
        }
        if (isCustomer) {
            window.location.href = '/login';
        }
        if (isOwner) {
            window.location.href = '/owner/login';
        }
        if (isAdmin) {
            window.location.href = '/admin/login';
        }
    };

    return (
        <div
            className={`min-h-full w-52 fixed left-0 top-0 p-4 text-black 
            ${isAdmin ? 'bg-[#FFD7B2]' :
                    isOwner ? 'bg-[#FFB2B2]' :
                        isCustomer ? 'bg-[#FFB2F3]' :
                            isDoctor ? 'bg-[#B2DAFF]' :
                                'bg-[#FFFFFF]'}`}
        >
            {isAdmin && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isAdminActive('/admin/Home')}`}>หน้าแรก</button>
                    <button onClick={ToServicePage} className={`hover:bg-white rounded ${isAdminActive('/admin/service')}`}>บริการของเรา</button>
                    <button onClick={ToOrderPage} className={`hover:bg-white rounded } ${isAdminActive('/admin/order')}`}>คำสั่งซื้อ</button>
                    <button onClick={ToStoragePage} className={`hover:bg-white rounded } ${isAdminActive('/admin/storage')}`}>คลัง</button>
                    <button onClick={ToUserManagement} className={`hover:bg-white rounded ${isAdminActive('/admin/user/management')}`}>จัดการผู้ใช้</button>
                    <button onClick={ToAccountPage} className={`hover:bg-white rounded ${isAdminActive('/admin/account')}`}>บัญชีของคุณ</button>
                    <button onClick={ToLogout} className={`hover:bg-white rounded `}>ออกจากระบบ</button>
                </div>
            )}
            {isOwner && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isOwnerActive('/owner/Home')}`}>หน้าแรก</button>
                    <button onClick={ToOrderPage} className={`hover:bg-white rounded ${isOwnerActive('/owner/order')}`}>คำสั่งซื้อ</button>
                    <button onClick={ToStoragePage} className={`hover:bg-white rounded ${isOwnerActive('/owner/storage')}`}>คลัง</button>
                    <button onClick={ToServicePage} className={`hover:bg-white rounded ${isOwnerActive('/owner/service')}`}>บริการของเรา</button>
                    <button onClick={ToUserManagement} className={`hover:bg-white rounded ${isOwnerActive('/owner/user/management')}`}>จัดการผู้ใช้</button>
                    <button onClick={ToAccountPage} className={`hover:bg-white rounded ${isOwnerActive('/owner/account')}`}>บัญชีของคุณ</button>
                    <button onClick={ToLogout} className={`hover:bg-white rounded `}>ออกจากระบบ</button>
                </div>
            )}
            {isCustomer && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isCustomerActive('/customer/Home')}`}>หน้าแรก</button>
                    <button onClick={ToRequestPage} className={`hover:bg-white rounded ${isCustomerActive('/customer/service/request')}`}>คำขอของฉัน</button>
                    <button onClick={ToRegisteredPage} className={`hover:bg-white rounded ${isCustomerActive('/customer/service')}`}>การนัดหมาย</button>
                    <button onClick={ToHistoryPage} className={`hover:bg-white rounded ${isCustomerActive('/customer/service/history')}`}>ประวัติการรักษา</button>
                    <button onClick={ToAccountPage} className={`hover:bg-white rounded ${isCustomerActive('/customer/account')}`}>บัญชีของคุณ</button>
                    <button onClick={ToLogout} className={`hover:bg-white rounded `}>ออกจากระบบ</button>
                </div>
            )}
            {isDoctor && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isDoctorActive('/doctor/Home')}`}>หน้าแรก</button>
                    <button onClick={ToTimeTable} className={`hover:bg-white rounded ${isDoctorActive('/doctor/time/table')}`}>ตารางนัดหมาย</button>
                    <button onClick={ToStoragePage} className={`hover:bg-white rounded ${isDoctorActive('/doctor/storage')}`}>คลัง</button>
                    <button onClick={ToHistoryPage} className={`hover:bg-white rounded ${isDoctorActive('/doctor/service/history')}`}>ประวัติการรักษา</button>
                    <button onClick={ToAccountPage} className={`hover:bg-white rounded ${isDoctorActive('/doctor/account')}`}>บัญชีของคุณ</button>
                    <button onClick={ToLogout} className={`hover:bg-white rounded `}>ออกจากระบบ</button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
