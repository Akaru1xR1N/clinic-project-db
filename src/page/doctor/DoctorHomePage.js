import React, { useEffect, useState } from 'react'
import { useDoctor } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Swal from 'sweetalert2';

function DoctorHomePage() {

  const { doctorDetail } = useDoctor();

  const [accepted, setAccepted] = useState(false);

  const [customerList, setCustomerList] = useState([]);
  const [clinicList, setClinicList] = useState([]);
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
        const requestResponse = await axios.get(process.env.REACT_APP_API_URL + 'doctor/viewRequestTime', { params: { clinicID: doctorDetail.clinicID } });
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

  }, [accepted]);

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

  const formattedDateTime = (startTime) => {
    const dateObject = new Date(startTime);

    const year = dateObject.getUTCFullYear();
    const month = dateObject.toLocaleString('en-US', { month: 'long' });
    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes} น.`;
  };

  const acceptRequest = async (typeID, customerID, startTime) => {
    setAccepted(false);

    const dateObject = new Date(startTime);

    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `;

    const RequestData = {
      clinicID: doctorDetail.clinicID,
      doctorID: doctorDetail.doctorID,
      typeID: typeID,
      customerID: customerID,
      startTime: formattedDate
    };

    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการอนุมัติคำขอใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(process.env.REACT_APP_API_URL + 'doctor/acceptRequestTime', RequestData);
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'อนุมัติคำขอเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1500
              });
              setAccepted(true);
            } else {
              console.error('ERROR FOUND');
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>บริการที่รออนุมัติ</h1>
      {requestList.map((request, index) => (
        <div key={index} className=' pb-4'>
          <div
            style={{
              backgroundColor: "#EAFAFF"
            }}
            className=' text-xl grid rounded-lg p-4 bg-slate-400'>
            <span className=' pb-4'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className=' pb-4'>ผู้รับบริการ: {matchingCustomer(request.customerID)}</span>
            <span className='pb-4'>วันที่นัดหมาย: {formattedDateTime(request.startTime)}</span>
            <div>
              <button
                // onClick={() => AddRequest(service.typeID)}
                onClick={() => acceptRequest(request.typeID, request.customerID, request.startTime)}
                className=' rounded-lg p-2' style={{
                  backgroundColor: '#ACFF79',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>อนุมัติ</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorHomePage