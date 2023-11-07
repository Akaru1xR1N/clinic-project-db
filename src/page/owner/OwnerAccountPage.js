import React, { useEffect, useState } from 'react'
import { useOwner } from '../../components/contexts/AdminContext'
import Swal from 'sweetalert2';
import axios from 'axios';

function OwnerAccountPage() {

  const { ownerDetail } = useOwner();

  const [Name, setName] = useState("");
  const [SurName, setSurName] = useState("");
  const [Email, setEmail] = useState("");
  const [NationalID, setNationalID] = useState('');
  const [Data, setData] = useState('');

  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const isOwnerLogined = localStorage.getItem('isOwnerLogined');

    if (isOwnerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/owner/login';
    }

    const fetchdata = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'owner', { params: { ownerID: ownerDetail.ownerID } });
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

  }, [edited]);

  const EditOwner = async () => {
    const UpdateOwner = {
      ownerID: ownerDetail.ownerID,
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
      <h1 className=' text-4xl font-normal text-center p-7'>บัญชีของคุณ</h1>
      <div>
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
          <button onClick={EditOwner} className=' rounded-lg p-3' style={{
            backgroundColor: '#FCFF79',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}>แก้ไข</button>
        </div>
      </div>
    </div>
  )
}

export default OwnerAccountPage