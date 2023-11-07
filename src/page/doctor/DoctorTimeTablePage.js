import React, { useEffect, useState } from 'react'
import { useDoctor } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Swal from 'sweetalert2';

function DoctorTimeTablePage() {

  const { doctorDetail } = useDoctor();

  const [finished, setFinished] = useState(false);

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
        const requestResponse = await axios.get(process.env.REACT_APP_API_URL + 'doctor/viewRequestTimeApprove', { params: { doctorID: doctorDetail.doctorID } });
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

  }, [finished]);

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

  const treatFinish = async (doctorID, startTime) => {
    setFinished(false);

    const currentDatetime = new Date(); // วันที่และเวลาปัจจุบัน
    const formattedStartTime = new Date(startTime.replace('T', ' ').replace('Z', '')); // แปลง startTime เป็น Object ของวันที่และเวลา

    // เปรียบเทียบว่าเวลาปัจจุบันมากกว่าหรือเท่ากับ startTime หรือไม่
    if (currentDatetime >= formattedStartTime) {
      await Swal.fire({
        icon: 'warning',
        title: 'เสร็จสิ้นการรักษาใช่หรือไม่?',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const RequestData = {
              doctorID: doctorID
            };

            const response = await axios.post(process.env.REACT_APP_API_URL + 'doctor/treatFinish', RequestData);
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'เสร็จสิ้น',
                showConfirmButton: false,
                timer: 1500
              });
              setFinished(true);
            } else {
              console.error('ERROR FOUND');
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    } else {
      // ถ้าเวลาปัจจุบันยังไม่ถึง startTime
      await Swal.fire({
        icon: 'error',
        title: 'ยังไม่ถึงวันที่นัดหมาย',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };


  return (
    <div className=''>
      <h1 className='text-4xl font-normal text-center p-7'>บริการที่อนุมัติแล้ว</h1>
      {requestList.map((request, index) => (
        <div key={index} className='pb-4'>
          <div className='text-2xl underline pb-2'>{formattedDateTime(request.startTime)}</div>
          <div className='bg-[#EAFAFF] rounded-lg p-4 mb-4'>
            <span className='block mb-2'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className='block pb-4'>ผู้รับบริการ: {matchingCustomer(request.customerID)}</span>
            <div>
              <button
                // onClick={() => AddRequest(service.typeID)}
                onClick={() => treatFinish(request.doctorID, request.startTime)}
                className=' rounded-lg p-2' style={{
                  backgroundColor: '#FF79E2',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>เสร็จสิ้น</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorTimeTablePage