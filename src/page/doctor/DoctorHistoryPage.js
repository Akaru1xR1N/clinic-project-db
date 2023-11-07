import React, { useEffect, useState } from 'react'
import { useDoctor } from '../../components/contexts/AdminContext'
import axios from 'axios';

function DoctorHistoryPage() {

  const { doctorDetail } = useDoctor();

  const [customerList, setCustomerList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const isDoctorLogined = localStorage.getItem('isDoctorLogined');

    if (isDoctorLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/doctor/login';
    }

    const fetchRequestData = async () => {
      try {
        // Fetch request data
        const requestResponse = await axios.get(process.env.REACT_APP_API_URL + 'doctor/viewHistoryAndEvaluate', { params: { doctorID: doctorDetail.doctorID } });
        if (!requestResponse.data.error) {
          setRequestList(requestResponse.data.data);
          const clinicIDsSet = new Set(requestResponse.data.data.map(request => request.clinicID));
          const clinicIDs = Array.from(clinicIDsSet);

          // Fetch service data for distinct clinicIDs using Promise.all
          const serviceResponses = await Promise.all(clinicIDs.map(clinicID => axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: clinicID } })));

          // Extract service data from each response and set the state
          const services = serviceResponses.map(response => response.data.data).flat();
          setServiceList(services);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const fetchCustomerData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'customer/list');
        if (!data.error) {
          setCustomerList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchRequestData();
    fetchCustomerData();

  }, []);

  const matchingServiceType = (typeID) => {
    const matchedService = serviceList.find(service => service.typeID === typeID);
    return matchedService ? matchedService.typeName : 'ไม่พบข้อมูลบริการ';
  };

  const matchingCustomer = (customerID) => {
    const matchedCustomer = customerList.find(customer => customer.customerID === customerID);
    if (matchedCustomer) {
      // ตรวจสอบว่า .surname มีค่าหรือไม่ แล้วกำหนดค่า default ถ้าไม่มีค่า
      const surname = matchedCustomer.surname || '';
      // สร้างชื่อโดยรวมกับ .surname 
      const fullName = `${matchedCustomer.name} ${surname}`;
      return fullName;
    } else {
      return 'ไม่พบข้อมูลบริการ';
    }
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
      <h1 className='text-4xl font-normal text-center p-7'>ประวัติการรักษา</h1>
      {requestList.map((request, index) => (
        <div key={index} className='pb-4'>
          <div className='text-2xl underline pb-2'>{formattedDateTime(request.time)}</div>
          <div className='bg-[#EAFAFF] rounded-lg p-4 mb-4'>
            <span className='block mb-2'>ผู้รับบริการ: {matchingCustomer(request.customerID)}</span>
            <span className='block mb-2'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className='block'>คะแนน: {request.score} /5</span>
            <span className='block'>ความคิดเห็น: {request.comment}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorHistoryPage