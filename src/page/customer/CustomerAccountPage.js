import React, { useEffect, useState } from 'react'
import { useCustomer } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerAccountPage() {

  const { customerDetail } = useCustomer();

  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [gender, setGender] = useState('');
  const [nationalID, setNationalID] = useState('');
  const [phone, setPhone] = useState('');
  const [blood, setBlood] = useState('');
  const [email, setEmail] = useState("");
  const [drugAllergy, setDrugAllergy] = useState('');
  const [disease, setDisease] = useState('');

  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const isCustomerLogined = localStorage.getItem('isCustomerLogined');

    if (isCustomerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/login';
    }

    const fetchCustomerData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'customer', { params: { customerID: customerDetail.customerID } });
        if (!data.error) {
          const { name, surname, gender, nationalID, phone, blood, email, drugAllergy, disease } = data.data;

          setName(name);
          setSurName(surname);
          setGender(gender);
          setNationalID(nationalID);
          setPhone(phone);
          setBlood(blood);
          setEmail(email);
          setDrugAllergy(drugAllergy);
          setDisease(disease);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomerData();

  }, [edited]);

  const EditCustomer = async () => {
    setEdited(false);
    const UpdateCustomer = {
      customerID: customerDetail.customerID,
      name: name,
      surname: surName,
      gender: gender,
      nationalID: nationalID,
      phone: phone,
      blood: blood,
      email: email,
      drugAllergy: drugAllergy,
      disease: disease,
    }

    try {
      await axios.put(process.env.REACT_APP_API_URL + 'customer', UpdateCustomer);
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
      <h1 className=' text-4xl font-normal text-center p-7'>สร้างบัญชี</h1>
      <div className=''>
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
          <span className=' text-xl font-normal mb-4'>เพศ</span>
          <select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
            onChange={(event) => {
              setGender(event.target.value);
            }}
            value={gender}
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
            value={nationalID}></input>
        </div>
        <div className=' grid pb-4'>
          <span className=' text-xl font-normal mb-4'>เบอร์มือถือ</span>
          <input className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
            onChange={(event) => {
              setPhone(event.target.value);
            }}
            value={phone}></input>
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
          <span className=' text-xl font-normal mb-4'>หมู่เลือด</span>
          <select className=' border-2 border-black rounded-full w-2/5 py-3 px-6'
            onChange={(event) => {
              setBlood(event.target.value);
            }}
            value={blood}
          >
            <option value={""}>---โปรดระบุหมู่เลือด---</option>
            <option value={"A"}>A</option>
            <option value={"B"}>B</option>
            <option value={"O"}>O</option>
            <option value={"AB"}>AB</option>
          </select>
        </div>
        <div className=' grid pb-4'>
          <span className=' text-xl font-normal mb-4'>การแพ้ยา</span>
          <textarea className=' border-2 border-black rounded-lg w-2/5 py-3 px-6'
            onChange={(event) => {
              setDrugAllergy(event.target.value);
            }}
            value={drugAllergy}></textarea>
        </div>
        <div className=' grid pb-4'>
          <span className=' text-xl font-normal mb-4'>โรคประจำตัว</span>
          <textarea className=' border-2 border-black rounded-lg w-2/5 py-3 px-6'
            onChange={(event) => {
              setDisease(event.target.value);
            }}
            value={disease}></textarea>
        </div>
      </div>
      <div className=' flex justify-around space-x-4'>
        <div className=' p-4'>
          <button onClick={EditCustomer} className=' rounded-lg p-3' style={{
            backgroundColor: '#FCFF79',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}>แก้ไข</button>
        </div>
      </div>
    </div>
  )
}

export default CustomerAccountPage