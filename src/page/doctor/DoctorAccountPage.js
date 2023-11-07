import React, { useEffect, useState } from 'react'
import { useDoctor } from '../../components/contexts/AdminContext'
import Swal from 'sweetalert2';
import axios from 'axios';

function DoctorAccountPage() {

  const { doctorDetail } = useDoctor();

  const [clinicID, setClinicID] = useState("");
  const [adminID, setAdminID] = useState("");

  const [Prefix, setPrefix] = useState('');
  const [Name, setName] = useState("");
  const [SurName, setSurName] = useState("");
  const [Gender, setGender] = useState("");
  const [NationalID, setNationalID] = useState("");
  const [Email, setEmail] = useState("");
  const [Data, setData] = useState("");

  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const isDoctorLogined = localStorage.getItem('isDoctorLogined');

    if (isDoctorLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/doctor/login';
    }

    const fetchDoctorData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'doctor', { params: { doctorID: doctorDetail.doctorID } });
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

  }, [edited]);

  const EditDoctor = async () => {
    setEdited(false);
    const UpdateDoctor = {
      clinicID: clinicID,
      adminID: adminID,
      doctorID: doctorDetail.doctorID,
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
      setEdited(true);
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
      <h1 className=' text-4xl font-normal text-center p-7'>ข้อมูลของคุณ</h1>
      <div>
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
          <button onClick={EditDoctor} className=' rounded-lg p-3' style={{
            backgroundColor: '#FCFF79',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}>แก้ไข</button>
        </div>
      </div>
    </div>
  )
}

export default DoctorAccountPage