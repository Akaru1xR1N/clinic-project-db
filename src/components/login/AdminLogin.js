import React, { useEffect, useState } from 'react';
import LoginNavbar from './LoginNavbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdmin } from '../contexts/AdminContext';

const AdminLogin = () => {
    localStorage.setItem('isAdminLogined', 'false');
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAdminDetail } = useAdmin();

    useEffect(() => {
        setAdminDetail(null);
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const LoginData = {
            email: email,
            password: password,
        }

        try {
            const { data } = await axios.post(process.env.REACT_APP_API_URL + 'admin/auth', LoginData);
            setAdminDetail(data.data);
            await Swal.fire({
                title: 'Login Complete!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            localStorage.setItem('isAdmin', true);
            localStorage.setItem('isOwner', false);
            localStorage.setItem('isCustomer', false);
            localStorage.setItem('isDoctor', false);
            localStorage.setItem('isAdminLogined', 'true');
            navigate('/admin/Home', { state: { isAdminLogined: true } });
        } catch (error) {
            Swal.fire({
                title: 'Login fail',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div>
            <div>
                <LoginNavbar />
            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Admin</h2>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={handleEmailChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                รหัสผ่าน
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="รหัสผ่าน"
                            />
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit}
                                className="mt-4 block w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AdminLogin;
