import React, { useEffect, useState } from 'react'
import { useCustomer } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Swal from 'sweetalert2';

function CustomerIn_ProgressPage() {

  const { customerDetail } = useCustomer();

  const [deleted, setDeleted] = useState(false);

  const [clinicList, setClinicList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    const isCustomerLogined = localStorage.getItem('isCustomerLogined');

    if (isCustomerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/login';
    }

    const fetchRequestData = async () => {
      try {
        // Fetch request data
        const requestResponse = await axios.get(process.env.REACT_APP_API_URL + 'customer/viewRequestTime', { params: { customerID: customerDetail.customerID } });
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

  }, [deleted]);

  const matchingServiceType = (typeID) => {
    const matchedService = serviceList.find(service => service.typeID === typeID);
    return matchedService ? matchedService.typeName : 'ไม่พบข้อมูลบริการ';
  };

  const matchingClinic = (clinicID) => {
    const matchedClinic = clinicList.find(clinic => clinic.clinicID === clinicID);
    return matchedClinic ? matchedClinic.name : 'ไม่พบข้อมูลบริการ';
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

  const cancleRequest = async (typeID, clinicID, startTime) => {
    setDeleted(false);

    const dateObject = new Date(startTime);

    const year = dateObject.getUTCFullYear();
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getUTCDate().toString().padStart(2, '0');

    const hours = dateObject.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObject.getUTCSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `;

    const RequestData = {
      clinicID: clinicID,
      typeID: typeID,
      customerID: customerDetail.customerID,
      startTime: formattedDate
    };

    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการยกเลิกคำขอใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + 'customer/serviceRequest', { data: RequestData });
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'ยกเลิกคำขอเสร็จสิ้น',
                showConfirmButton: false,
                timer: 1500
              });
              setDeleted(true);
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
              backgroundColor: "#FFEAFC"
            }}
            className=' text-xl grid rounded-lg p-4 bg-slate-400'>
            <span className=' pb-4'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className=' pb-4'>สาขา: {matchingClinic(request.clinicID)}</span>
            <span className='pb-4'>วันที่นัดหมาย: {formattedDateTime(request.startTime)}</span>
            <div>
              <button
                // onClick={() => AddRequest(service.typeID)}
                onClick={() => cancleRequest(request.typeID, request.clinicID, request.startTime)}
                className=' rounded-lg p-2' style={{
                  backgroundColor: '#FF0000',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>ยกเลิก</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomerIn_ProgressPage