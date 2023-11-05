import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Select from 'react-select';
import Swal from 'sweetalert2';

function OwnerEditClinic() {

    //LoadData
    const { clinicID } = useParams();
    const [ProvinceAPI, setProvinceAPI] = useState([]);
    const [AmphuresAPI, setAmphuresAPI] = useState([]);
    const [TambonsAPI, setTambonsAPI] = useState([]);

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

    useEffect(() => {
        const isOwnerLogined = localStorage.getItem('isOwnerLogined');

        if (isOwnerLogined !== 'true') {
            // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
            window.location.href = '/owner/login';
        }

        const fetchData = async () => {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic', { params: { clinicID } });
                if (!data.error) {
                    const createDate = new Date(data.data.createDate);
                    const formattedDate = `${createDate.toISOString().split('T')[0]}`;
                    setCreateDate(formattedDate);
                    const { name, place, province, amphure, tambon, zip_code, detail, totalMoney } = data.data;
                    setName(name);
                    setPlace(place);
                    setProvince(province);
                    setAmphures(amphure);
                    setTambons(tambon);
                    setZipcode(zip_code);
                    setDetail(detail);
                    setTotalMoney(totalMoney);
                }
            } catch (error) {
                console.error(error);
            }
        };
        const getProvince = async () => {
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
                console.error(error);
            }
        }

        fetchData();
        getProvince();
    }, [clinicID]);

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

    const ToOwnerHome = () => {
        window.location.href = "/owner/Home";
    };

    const EditClinic = async () => {
        const UpdateClinic = {
            clinicID: clinicID,
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
            await axios.put(process.env.REACT_APP_API_URL + 'clinic', UpdateClinic);
            setData([...Data, UpdateClinic]);
            await Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1000
            });
            window.location.href = '/owner/Home';
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "โปรดตรวจสอบข้อมูล",
                showCancelButton: false,
                timer: 2000
            });
        }
    };

    return (
        <div>
            <h1 className=' text-4xl font-normal text-center p-7'>แก้ไขข้อมูลสาขา</h1>
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
                        value={{ label: Province }}
                        options={ProvinceAPI}
                        onChange={onchangeProvince}
                        placeholder='---โปรดระบุชื่อจังหวัด---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>อำเภอ</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={{ label: Amphures }}
                        options={AmphuresAPI}
                        onChange={onchangeAmphures}
                        placeholder='---โปรดระบุอำเภอ---'>
                    </Select>
                </div>
                <div className=' grid pb-4'>
                    <span className=' text-xl font-normal mb-4'>ตำบล</span>
                    <Select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
                        value={{ label: Tambons }}
                        options={TambonsAPI}
                        onChange={onchangeTambons}
                        placeholder='---โปรดระบุตำบล---'>
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
                    <button onClick={EditClinic} className=' rounded-lg p-3' style={{
                        backgroundColor: '#FCFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>แก้ไข</button>
                </div>
            </div>
        </div>
    )
}

export default OwnerEditClinic