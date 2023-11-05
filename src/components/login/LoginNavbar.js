import React from 'react'

function LoginNavbar() {

    const ToCustomerLogin = () => {
        window.location.href = '/login';
    };

    const ToOwnerLogin = () => {
        window.location.href = '/owner/login';
    };

    const ToAdminLogin = () => {
        window.location.href = '/admin/login';
    };

    const ToDoctorLogin = () => {
        window.location.href = '/doctor/login';
    };

    return (
        <div>
            <div className=' flex flex-row-reverse p-4 bg-gray-50'>
                <div className=' flex space-x-4 underline'>
                    <button onClick={ToCustomerLogin}>Customer</button>
                    <button onClick={ToOwnerLogin}>Owner</button>
                    <button onClick={ToDoctorLogin}>Doctor</button>
                    <button onClick={ToAdminLogin}>Admin</button>
                </div>
            </div>
        </div>
    )
}

export default LoginNavbar