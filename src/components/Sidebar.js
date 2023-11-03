import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Sidebar() {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const isAdminUser = localStorage.getItem('isAdmin');
        setIsAdmin(isAdminUser === 'true');

        const isOwnerUser = localStorage.getItem('isOwner');
        setIsOwner(isOwnerUser === 'true');
    }, []);

    const isAdminActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const isOwnerActive = (path) => {
        return location.pathname === path ? 'bg-white' : '';
    };

    const ToOwnerHome = () => {
        if (isAdmin) {
            window.location.href = '/admin/Home';
        }
        if (isOwner) {
            window.location.href = '/owner/Home';
        }
    };

    const ToServicePage = () => {
        if (isOwner) {
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

    return (
        <div
            className={`min-h-full w-52 fixed left-0 top-0 p-4 text-black ${isAdmin ? 'bg-[#FFD7B2]' : isOwner ? 'bg-[#FFB2B2]' : 'bg-[#FFFFFF]'}`}
        >
            {isAdmin && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isAdminActive('/admin/Home')}`}>หน้าแรก</button>
                    <button onClick={ToServicePage} className={`hover:bg-white rounded ${isAdminActive('/admin/service')}`}>บริการของเรา</button>
                    <button className={`hover:bg-white rounded }`}>คำสั่งซื้อ</button>
                    <button className={`hover:bg-white rounded }`}>คลัง</button>
                    <button onClick={ToUserManagement} className={`hover:bg-white rounded ${isAdminActive('/admin/user/management')}`}>จัดการผู้ใช้</button>
                </div>
            )}
            {isOwner && (
                <div className="flex flex-col space-y-4 text-center text-2xl font-normal pt-4">
                    <button onClick={ToOwnerHome} className={`hover:bg-white rounded ${isOwnerActive('/owner/Home')}`}>หน้าแรก</button>
                    <button className={`hover:bg-white rounded ${isOwnerActive('/owner/orders')}`}>คำสั่งซื้อ</button>
                    <button className={`hover:bg-white rounded ${isOwnerActive('/owner/inventory')}`}>คลัง</button>
                    <button onClick={ToServicePage} className={`hover:bg-white rounded ${isOwnerActive('/owner/service')}`}>บริการของเรา</button>
                    <button onClick={ToUserManagement} className={`hover:bg-white rounded ${isOwnerActive('/owner/user/management')}`}>จัดการผู้ใช้</button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
