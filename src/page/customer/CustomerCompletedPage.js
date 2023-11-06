import React, { useEffect, useState } from 'react'
import { useCustomer } from '../../components/contexts/AdminContext'
import axios from 'axios';

function CustomerCompletedPage() {

  const { customerDetail } = useCustomer();

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

  }, []);

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

  return (
    <div className=''>
      <h1 className='text-4xl font-normal text-center p-7'>ขอบคุณที่ใช้บริการ</h1>
      {requestList.map((request, index) => (
        <div key={index} className='pb-4'>
          <div className='text-2xl underline pb-2'>{formattedDateTime(request.time)}</div>
          <div className='bg-pink-100 rounded-lg p-4 mb-4'>
          <span className='block mb-2'>แพทย์: {matchingDoctor(request.doctorID)}</span>
            <span className='block mb-2'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className='block'>สาขา: {matchingClinic(request.clinicID)}</span>
            <span className='block'>คะแนน: {request.score}</span>
            <span className='block'>ความคิดเห็น: {request.comment}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomerCompletedPage