import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function OwnerEditOwner() {

    const { ownerID } = useParams();

    const [Name, setName] = useState("");
    const [SurName, setSurName] = useState("");
    const [Email, setEmail] = useState("");
    const [NationalID, setNationalID] = useState('');
    const [Data, setData] = useState('');

    const [deleted, setDeleted] = useState(false);

    const ToUserManagement = () => {
        window.location.href = '/owner/user/management';
    };

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'owner', { params: { ownerID } });
                if (!data.error) {
                    const { name, surname, email, nationalID } = data.data;
                    setName(name);
                    setSurName(surname);
                    setEmail(email);
                    setNationalID(nationalID);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchdata();
    }, [ownerID, deleted]);

    const EditOwner = async () => {
        const UpdateOwner = {
            ownerID: ownerID,
            name: Name,
            surname: SurName,
            nationalID: NationalID,
            email: Email,
        }

        try {
            await axios.put(process.env.REACT_APP_API_URL + 'owner', UpdateOwner);
            setData([...Data, UpdateOwner]);
            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/user/management';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showCancelButton: false,
                timer: 2000
            });
        }
    };

    const deletedOwner = async (ownerID) => {
        await Swal.fire({
            icon: 'warning',
            title: 'ต้องการลบเจ้าของใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.delete(process.env.REACT_APP_API_URL + 'owner', { data: { ownerID: ownerID } });
                        if (response.status === 200) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'ลบข้อมูลเสร็จสิ้น',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setDeleted(true);
                            window.location.href = '/owner/user/management';
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
            <h1 className=' text-4xl font-normal text-center p-7'>แก้ไขข้อมูลเจ้าของ</h1>
            <div>
                <div className=' flex place-content-end mr-14'>
                    <button onClick={() => deletedOwner(ownerID)} className=' p-2 rounded-lg'
                        style={{
                            backgroundColor: "#FF0000"
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
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
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToUserManagement} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={EditOwner} className=' rounded-lg p-3' style={{
                        backgroundColor: '#FCFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>แก้ไข</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerEditOwner