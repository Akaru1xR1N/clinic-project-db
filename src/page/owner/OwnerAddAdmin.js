import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Swal from 'sweetalert2';

function OwnerAddAdmin() {

    const [Name, setName] = useState("");
    const [SurName, setSurName] = useState("");
    const [NationalID, setNationalID] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [Email, setEmail] = useState("");
    const [clinicID, setClinicID] = useState("");
    const [data, setData] = useState("");

    //FromAPI
    const [clinicAPI, setClinicAPI] = useState([]);

    useEffect(() => {
        const isOwnerLogined = localStorage.getItem('isOwnerLogined');

        if (isOwnerLogined !== 'true') {
            // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
            window.location.href = '/owner/login';
        }
        
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(clinic => ({
                        value: clinic.clinicID,
                        label: clinic.name,
                        clinicID: clinic.clinicID
                    }))
                    setClinicAPI(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const onchangeClinic = async (clinicAPI) => {
        setClinicID(clinicAPI.clinicID);
    };

    const ToUserManagement = () => {
        window.location.href = '/owner/user/management';
    };

    const AddAdmin = async () => {
        if (Password !== ConfirmPassword) {
            Swal.fire({
                icon: 'error',
                title: "รหัสผ่านไม่ตรงกัน",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }
        const newAdmin = {
            clinicID: clinicID,
            name: Name,
            surname: SurName,
            nationalID: NationalID,
            password: Password,
            email: Email
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'admin', newAdmin);
            setData([...data, newAdmin]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มผู้ดูแลระบบเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = "/owner/user/management"
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
            <h1 className=' text-4xl font-normal text-center p-7'>เพิ่มผู้ดูแลระบบ</h1>
            <div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>สาขา</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={clinicAPI}
                        onChange={onchangeClinic}
                        placeholder='---โปรดระบุชื่อสาขา---'>
                    </Select>
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
                    <button onClick={AddAdmin} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>เพิ่มผู้ดูแลระบบ</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerAddAdmin