import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select';
import Swal from 'sweetalert2';

function OwnerEditService() {

    const { typeID } = useParams();
    const [CategoryID, setCategoryID] = useState('');
    const [ClinicID, setClinicID] = useState('');
    const [TypeName, setTypeName] = useState('');
    const [Duration, setDuration] = useState('');
    const [Price, setPrice] = useState('');
    const [Data, setData] = useState('');

    const [clinicInfo, setClinicInfo] = useState('');
    const [clinicName, setClinicName] = useState('');

    const [categoryInfo, setCategoryInfo] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const [deleted, setDeleted] = useState(false);

    const [clinicList, setClinicList] = useState('');
    const [categoryList, setCategoryList] = useState('');

    useEffect(() => {
        const fetchServiceInfo = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type', { params: { typeID } });
                if (!data.error) {
                    const { categoryID, clinicID, typeName, duration, price } = data.data;
                    setCategoryInfo(categoryID);
                    setClinicInfo(clinicID);
                    setCategoryID(categoryID);
                    setClinicID(clinicID);
                    setTypeName(typeName);
                    setDuration(duration);
                    setPrice(price);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchClinicData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
                const responseData = response.data;
                if (!responseData.error) {
                    const clinics = responseData.data;
                    const options = responseData.data.map(clinic => ({
                        value: clinic.clinicID,
                        label: clinic.name,
                        clinicID: clinic.clinicID,
                        clinicName: clinic.name
                    }));

                    const matchingClinic = clinics.find(clinic => clinic.clinicID === clinicInfo);
                    if (matchingClinic) {
                        setClinicName(matchingClinic.name);
                    }
                    setClinicList(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCategoryData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/inused');
                const responseData = response.data;
                if (!responseData.error) {
                    const categories = responseData.data;
                    const options = responseData.data.map(category => ({
                        value: category.categoryID,
                        label: category.categoryName,
                        categoryID: category.categoryID,
                        categoryName: category.categoryName
                    }));

                    const matchingCategory = categories.find(category => category.categoryID === categoryInfo);
                    if (matchingCategory) {
                        setCategoryName(matchingCategory.categoryName);
                    }
                    setCategoryList(options);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchServiceInfo();
        fetchClinicData();
        fetchCategoryData();

    }, [typeID, categoryInfo, deleted, clinicInfo]);

    const ToServicePage = () => {
        window.location.href = '/owner/service';
    };

    const EditService = async () => {
        const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

        if (regex.test(Duration)) {
            setDuration(Duration);
        } else {
            Swal.fire({
                icon: 'error',
                title: "รูปแบบระยะเวลาไม่ถูกต้อง",
                showConfirmButton: false,
                timer: 2000,
            });
            return;
        }

        const UpdateService = {
            typeID: typeID,
            categoryID: CategoryID,
            clinicID: ClinicID,
            typeName: TypeName,
            duration: Duration,
            price: Price
        }

        try {
            await axios.put(process.env.REACT_APP_API_URL + 'clinic/service/type', UpdateService);
            setData([...Data, UpdateService]);
            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/service';
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const onchangeClinic = async (clinicList) => {
        setClinicID(clinicList.clinicID);
        setClinicName(clinicList.clinicName);
    };

    const onchangeCategory = async (categoryList) => {
        setCategoryID(categoryList.categoryID);
        setCategoryName(categoryList.categoryName);
    };

    const deleteService = async () => {
        await Swal.fire({
            icon: 'warning',
            title: 'ต้องการลบบริการใช่หรือไม่?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.delete(process.env.REACT_APP_API_URL + '/clinic/service/type', { data: { typeID: typeID } });
                        if (response.status === 200) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'ลบข้อมูลเสร็จสิ้น',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setDeleted(true);
                            window.location.href = '/owner/service';
                        } else {
                            console.error("ERRRO FOUND");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            })
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>แก้ไขข้อมูลบริการ</h1>
            <div>
                <div className=' flex place-content-end mr-14'>
                    <button onClick={() => deleteService(typeID)} className=' p-2 rounded-lg'
                        style={{
                            backgroundColor: "#FF0000"
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>สาขา</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={{ label: clinicName }}
                        options={clinicList}
                        onChange={onchangeClinic}
                        placeholder='---โปรดระบุชื่อสาขา---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>หมวดหมู่ของบริการ</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={{ label: categoryName }}
                        options={categoryList}
                        onChange={onchangeCategory}
                        placeholder='---โปรดระบุชื่อหมวดหมู่---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อบริการ</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setTypeName(event.target.value);
                        }}
                        value={TypeName}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ระยะเวลา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setDuration(event.target.value);
                        }}
                        value={Duration}
                        placeholder='ชั่วโมง:นาที:วินาที เช่น 11:40:00'></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ราคา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setPrice(event.target.value);
                        }}
                        value={Price}></input>
                </div>
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToServicePage} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={EditService} className=' rounded-lg p-3' style={{
                        backgroundColor: '#FCFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>แก้ไข</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerEditService