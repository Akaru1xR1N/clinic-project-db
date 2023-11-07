import React, { useEffect, useState } from 'react'
import { useCustomer } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Popup from 'reactjs-popup';
import Swal from 'sweetalert2';

function CustomerCompletedPage() {

  const { customerDetail } = useCustomer();

  const [doctorID, setDoctorID] = useState('');
  const [typeID, setTypeID] = useState('');
  const [time, setTime] = useState('');
  const [score, setScore] = useState(1);
  const [comment, setComment] = useState('');

  const [reviewed, setReviewed] = useState(false);
  const [isReviewVisible, setIsReviewVisible] = useState(false);

  const [doctorList, setDoctorList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [clinicList, setClinicList] = useState([]);

  useEffect(() => {
    const isCustomerLogined = localStorage.getItem('isCustomerLogined');

    if (isCustomerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/login';
    }

    const fetchRequestData = async () => {
      try {
        // Fetch request data
        const requestResponse = await axios.get(process.env.REACT_APP_API_URL + 'customer/viewHistoryAndEvaluate', { params: { customerID: customerDetail.customerID } });
        if (!requestResponse.data.error) {
          setRequestList(requestResponse.data.data);
          const clinicIDsSet = new Set(requestResponse.data.data.map(request => request.clinicID));
          const clinicIDs = Array.from(clinicIDsSet);

          // Fetch service data for distinct clinicIDs using Promise.all
          const serviceResponses = await Promise.all(clinicIDs.map(clinicID => axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: clinicID } })));
          const doctorResponses = await Promise.all(clinicIDs.map(clinicID => axios.get(process.env.REACT_APP_API_URL + 'doctor/list', { params: { clinicID: clinicID } })));

          // Extract service data from each response and set the state
          const services = serviceResponses.map(response => response.data.data).flat();
          setServiceList(services);

          const doctors = doctorResponses.map(response => response.data.data).flat();
          setDoctorList(doctors);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const fetchClinicData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
        if (!data.error) {
          setClinicList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRequestData();
    fetchClinicData();

  }, [reviewed]);

  const matchingServiceType = (typeID) => {
    const matchedService = serviceList.find(service => service.typeID === typeID);
    return matchedService ? matchedService.typeName : 'ไม่พบข้อมูลบริการ';
  };

  const matchingDoctor = (doctorID) => {
    const matchedDoctor = doctorList.find(doctor => doctor.doctorID === doctorID);
    if (matchedDoctor) {
      // ตรวจสอบว่า .surname และ .prefix มีค่าหรือไม่ แล้วกำหนดค่า default ถ้าไม่มีค่า
      const surname = matchedDoctor.surname || '';
      const prefix = matchedDoctor.prefix || '';
      // สร้างชื่อแพทย์โดยรวมกับ .surname และ .prefix
      const fullName = `${prefix} ${matchedDoctor.name} ${surname}`;
      return fullName;
    } else {
      return 'ไม่พบข้อมูลบริการ';
    }
  };

  const matchingClinic = (clinicID) => {
    const matchedClinic = clinicList.find(clinic => clinic.clinicID === clinicID);
    return matchedClinic ? matchedClinic.name : 'ไม่พบข้อมูลบริการ';
  };

  const formattedDateTime = (time) => {
    const dateObject = new Date(time);

    const year = dateObject.getUTCFullYear();
    const month = dateObject.toLocaleString('en-US', { month: 'long' });
    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes} น.`;
  };

  const AddReview = async (doctorID, typeID, time) => {
    setReviewed(false);

    const dateObject = new Date(time);

    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `;

    const newReview = {
      customerID: customerDetail.customerID,
      doctorID: doctorID,
      typeID: typeID,
      time: formattedDate,
      score: score,
      comment: comment
    };

    try {
      await axios.post(process.env.REACT_APP_API_URL + 'customer/review', newReview);
      await Swal.fire({
        icon: 'success',
        title: 'เสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      })
      setIsReviewVisible(false);
      setReviewed(true);
      setDoctorID('');
      setTypeID('');
      setTime('');
      setScore(1);
      setComment('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'โปรดตรวจสอบข้อมูล',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  return (
    <div className=''>
      <h1 className='text-4xl font-normal text-center p-7'>ขอบคุณที่ใช้บริการ</h1>
      {requestList.map((request, index) => (
        <div key={index} className='pb-4'>
          <div className='text-2xl underline pb-2'>{formattedDateTime(request.time)}</div>
          <div className='bg-pink-100 rounded-lg p-4 mb-4'>
            <span className='block mb-2'>แพทย์: {matchingDoctor(request.doctorID)}</span>
            <span className='block mb-2'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className='block mb-2'>สาขา: {matchingClinic(request.clinicID)}</span>
            <span className='block mb-2'>คะแนน: {request.score} /5</span>
            <span className='block pb-4'>ความคิดเห็น: {request.comment}</span>
            <div>
              <button
                // onClick={() => AddRequest(service.typeID)}
                // onClick={() => treatFinish(request.doctorID, request.startTime)}
                onClick={() => {
                  setIsReviewVisible(true);
                  setDoctorID(request.doctorID);
                  setTypeID(request.typeID);
                  setTime(request.time);
                }}
                className=' rounded-lg p-2' style={{
                  backgroundColor: '#FFFA79',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>ให้คะแนน</button>
            </div>
          </div>
        </div>
      ))}
      <Popup
        trigger={null}
        open={isReviewVisible}
        onClose={() => setIsReviewVisible(false)}
        contentStyle={{
          width: 500,
        }}>
        <div className=' grid pb-4 place-items-center'>
          <span className=' text-xl font-normal mb-4 mt-2'>คุณรู้สึกอย่างไรกับบริการของเรา</span>
          <div className=' grid pb-4'>
            <span className=' text-xl font-normal mb-4'>ให้คะแนน</span>
            <select className=' border-2 border-black rounded-full w-full py-3 px-6'
              onChange={(event) => {
                setScore(event.target.value);
              }}
              value={score}
            >
              <option value={""}>---โปรดระบุคะแนน---</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className=' grid pb-4 px-4 w-full'>
            <span className=' text-xl font-normal mb-4'>ความคิดเห็น</span>
            <textarea className=' border-2 border-black rounded-lg w-full py-3 px-6'
              onChange={(event) => {
                setComment(event.target.value);
              }}
              value={comment}></textarea>
          </div>
          <button
            onClick={() => AddReview(doctorID, typeID, time)}
            className=' rounded-lg px-2 py-2 mt-4' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>ส่ง
          </button>
        </div>
      </Popup>
    </div>
  )
}

export default CustomerCompletedPage