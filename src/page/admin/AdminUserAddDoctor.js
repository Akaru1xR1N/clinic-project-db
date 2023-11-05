import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

function AdminUserAddDoctor() {

    const [clinicID, setClinicID] = useState("1");
    const [adminID, setAdminID] = useState("5");

    const [Prefix, setPrefix] = useState('');
    const [Name, setName] = useState("");
    const [SurName, setSurName] = useState("");
    const [Gender, setGender] = useState("");
    const [NationalID, setNationalID] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Email, setEmail] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        const isAdminLogined = localStorage.getItem('isAdminLogined');

        if (isAdminLogined !== 'true') {
            // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
            window.location.href = '/admin/login';
        }
    }, [])

    const ToUserManagement = () => {
        window.location.href = '/admin/user/management';
    }

    const AddDoctor = async () => {
        if (Password !== ConfirmPassword) {
            Swal.fire({
                icon: 'error',
                title: "รหัสผ่านไม่ตรงกัน",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const newDoctor = {
            clinicID: clinicID,
            adminID: adminID,
            prefix: Prefix,
            name: Name,
            surname: SurName,
            gender: Gender,
            nationalID: NationalID,
            password: Password,
            email: Email
        };

        try {
            console.log(newDoctor);
            await axios.post(process.env.REACT_APP_API_URL + 'doctor', newDoctor);
            setData([...data, newDoctor]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มหมอเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = "/admin/user/management"
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>เพิ่มหมอ</h1>
            <div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>สาขา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={clinicID}
                    />
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รหัสแอดมิน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={adminID}
                    />
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>คำนำหน้าชื่อ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPrefix(event.target.value);
                        }}
                        value={Prefix}
                        placeholder='เช่น ศาสตราจารย์'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        value={Name}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>นามสกุล</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setSurName(event.target.value);
                        }}
                        value={SurName}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เพศ</span>
                    <select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setGender(event.target.value);
                        }}
                        value={Gender}
                    >
                        <option value={""}>---โปรดระบุเพศ---</option>
                        <option value={"F"}>หญิง</option>
                        <option value={"M"}>ชาย</option>
                    </select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เลขประจำตัวประชาชน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setNationalID(event.target.value);
                        }}
                        value={NationalID}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>Email</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                        value={Email}
                        type='email'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        value={Password}
                        type='password'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ยืนยันรหัสผ่าน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                        value={ConfirmPassword}
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
                    <button onClick={AddDoctor} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>เพิ่มหมอ</button>
                </div>
            </div>
        </div>
    )
}

export default AdminUserAddDoctor