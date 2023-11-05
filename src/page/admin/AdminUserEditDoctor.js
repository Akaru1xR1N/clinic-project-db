import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminUserEditDoctor() {

    const { doctorID } = useParams();

    const [clinicID, setClinicID] = useState("");
    const [adminID, setAdminID] = useState("");

    const [Prefix, setPrefix] = useState('');
    const [Name, setName] = useState("");
    const [SurName, setSurName] = useState("");
    const [Gender, setGender] = useState("");
    const [NationalID, setNationalID] = useState("");
    const [Email, setEmail] = useState("");
    const [Data, setData] = useState("");

    const [deleted, setDeleted] = useState(false);

    const [clinicList, setClinicList] = useState([]);

    useEffect(() => {
        const isAdminLogined = localStorage.getItem('isAdminLogined');

        if (isAdminLogined !== 'true') {
            // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
            window.location.href = '/admin/login';
        }

        const fetchDoctorData = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'doctor', { params: { doctorID } });
                if (!data.error) {
                    const { prefix, name, surname, gender, email, nationalID, clinicID, adminID } = data.data;
                    setPrefix(prefix);
                    setName(name);
                    setSurName(surname);
                    setGender(gender);
                    setEmail(email);
                    setNationalID(nationalID);
                    setClinicID(clinicID);
                    setAdminID(adminID);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDoctorData();
    }, [adminID, deleted, doctorID]);

    const ToUserManagement = () => {
        window.location.href = '/admin/user/management';
    };

    const EditDoctor = async () => {
        const UpdateDoctor = {
            clinicID: clinicID,
            adminID: adminID,
            doctorID: doctorID,
            prefix: Prefix,
            name: Name,
            surname: SurName,
            gender: Gender,
            nationalID: NationalID,
            email: Email,
        }

        try {
            await axios.put(process.env.REACT_APP_API_URL + 'doctor', UpdateDoctor);
            setData([...Data, UpdateDoctor]);
            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/admin/user/management';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showCancelButton: false,
                timer: 2000
            });
        }
    };

    const deleteDoctor = async (doctorID) => {
        await Swal.fire({
            icon: 'warning',
            title: 'ต้องการลบหมอใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.delete(process.env.REACT_APP_API_URL + 'doctor', { data: { doctorID: doctorID } });
                        if (response.status === 200) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'ลบข้อมูลเสร็จสิ้น',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setDeleted(true);
                            window.location.href = '/admin/user/management';
                        } else {
                            console.error('ERROR FOUND');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
    }

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>แก้ไขข้อมูลหมอ</h1>
            <div>
                <div className=' flex place-content-end mr-14'>
                    <button onClick={() => deleteDoctor(doctorID)} className=' p-2 rounded-lg'
                        style={{
                            backgroundColor: "#FF0000"
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>คำนำหน้าชื่อ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPrefix(event.target.value);
                        }}
                        value={Prefix}></input>
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
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToUserManagement} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={EditDoctor} className=' rounded-lg p-3' style={{
                        backgroundColor: '#FCFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>แก้ไข</button>
                </div>
            </div>
        </div>
    )
}

export default AdminUserEditDoctor