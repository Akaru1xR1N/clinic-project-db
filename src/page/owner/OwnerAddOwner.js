import axios from 'axios';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

function OwnerAddOwner() {

    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nationalID, setNationalID] = useState('');
    const [data, setData] = useState('');

    const AddOwner = async () => {
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: "รหัสผ่านไม่ตรงกัน",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const newOwner = {
            name: name,
            surname: surName,
            nationalID: nationalID,
            email: email,
            password: password
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'owner', newOwner);
            setData([...data, newOwner]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มเจ้าของเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/user/management';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const ToUserManagement = () => {
        window.location.href = '/owner/user/management';
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>เพิ่มเจ้าของ</h1>
            <div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        value={name}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>นามสกุล</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setSurName(event.target.value);
                        }}
                        value={surName}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เลขประจำตัวประชาชน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setNationalID(event.target.value);
                        }}
                        value={nationalID}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>Email</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        value={email}
                        type='email'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        value={password}
                        type='password'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ยืนยันรหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                        value={confirmPassword}
                        type='password'></input>
                </div>
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToUserManagement} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={AddOwner} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>เพิ่มเจ้าของ</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerAddOwner