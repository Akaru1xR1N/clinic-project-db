import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';

function OwnerAddClinic() {

    //setData
    const [Province, setProvince] = useState("");
    const [Amphures, setAmphures] = useState("");
    const [Tambons, setTambons] = useState("");
    const [Zipcode, setZipcode] = useState("");
    const [Name, setName] = useState("");
    const [Place, setPlace] = useState("");
    const [Detail, setDetail] = useState("");
    const [TotalMoney, setTotalMoney] = useState("");
    const [CreateDate, setCreateDate] = useState("");
    const [Data, setData] = useState("");

    //API
    const [ProvinceAPI, setProvinceAPI] = useState([]);
    const [AmphuresAPI, setAmphuresAPI] = useState([]);
    const [TambonsAPI, setTambonsAPI] = useState([]);


    const ToOwnerHome = () => {
        window.location.href = '/owner/Home';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/location');
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(province => ({
                        value: province.province_id,
                        label: province.name_th,
                        provinceName: province.name_th
                    }))
                    setProvinceAPI(options);
                }
            } catch (error) {
            }
        };

        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2,'0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate;
        };

        fetchData();
        setCreateDate(getCurrentDate());
    }, [])

    const onchangeProvince = async (ProvinceAPI) => {
        setProvince(ProvinceAPI.provinceName);
        if (ProvinceAPI) {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/location/amphures', { params: { province_id: ProvinceAPI.value } });
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(amphure => ({
                        value: amphure.amphure_id,
                        label: amphure.name_th,
                        amphureName: amphure.name_th
                    }))
                    setAmphuresAPI(options);
                }
            } catch (error) {
            }
        }
    };
    
    const onchangeAmphures = async (AmphuresAPI) => {
        setAmphures(AmphuresAPI.amphureName);
        if (AmphuresAPI) {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/location/tambons', { params: { amphure_id: AmphuresAPI.value } });
                const responseData = response.data;
                if (!responseData.error) {
                    const options = responseData.data.map(tambon => ({
                        value: tambon.tambon_id,
                        label: tambon.name_th,
                        tambonName: tambon.name_th,
                        zipcode: tambon.zip_code
                    }))
                    setTambonsAPI(options);
                }
            } catch (error) {
            }
        }
    };

    const onchangeTambons = (TambonsAPI) => {
        setTambons(TambonsAPI.tambonName);
        setZipcode(TambonsAPI.zipcode);
    };

    const AddClinic = async () => {
        const newClinic = {
            name: Name,
            province: Province,
            amphure: Amphures,
            tambon: Tambons,
            zip_code: Zipcode,
            place: Place,
            detail: Detail,
            totalMoney: TotalMoney,
            createDate: CreateDate
        };

        try {
            await axios.post(process.env.REACT_APP_API_URL + 'clinic', newClinic);
            setData([...Data, newClinic]);
            await Swal.fire({
                icon: 'success',
                title: 'เพิ่มคลินิกเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/Home';
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
            <h1 className=' text-4xl font-normal text-center p-7'>เพิ่มสาขา</h1>
            <div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>วันที่สร้าง</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        type='date'
                        onChange={(event) => {
                            setCreateDate(event.target.value);
                        }}
                        value={CreateDate}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ชื่อสาขา</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        value={Name}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ที่อยู่</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        placeholder='เช่น บ้านเลขที่ หมู่ ถนน ซอย เป็นต้น'
                        onChange={(event) => {
                            setPlace(event.target.value);
                        }}
                        value={Place}></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>จังหวัด</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={ProvinceAPI}
                        onChange={onchangeProvince}
                        placeholder='---โปรดระบุชื่อจังหวัด---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>อำเภอ</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={AmphuresAPI}
                        onChange={onchangeAmphures}
                        placeholder='---โปรดระบุอำเภอ---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ตำบล</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        options={TambonsAPI}
                        onChange={onchangeTambons}>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รหัสไปรษณีย์</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={Zipcode}
                        readOnly></input>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>รายละเอียด</span>
                    <textarea className=' border-2 border-black rounded-lg w-2/5 py-3 px-6'
                        onChange={(event) => {
                            setDetail(event.target.value);
                        }}
                        value={Detail}></textarea>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>เงินทุน</span>
                    <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        type='number'
                        onChange={(event) => {
                            setTotalMoney(event.target.value);
                        }}
                        value={TotalMoney}></input>
                </div>
            </div>
            <div className=' flex justify-around space-x-4'>
                <div className=' p-4'>
                    <button onClick={ToOwnerHome} className=' rounded-lg p-3' style={{
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>กลับ</button>
                </div>
                <div className=' p-4'>
                    <button onClick={AddClinic} className=' rounded-lg p-3' style={{
                        backgroundColor: '#ACFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>เพิ่มสาขา</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerAddClinic