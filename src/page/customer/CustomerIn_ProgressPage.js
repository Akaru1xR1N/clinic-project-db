import React, { useEffect, useState } from 'react'
import { useCustomer } from '../../components/contexts/AdminContext'
import axios from 'axios';

function CustomerIn_ProgressPage() {

  const { customerDetail } = useCustomer();

  const [typeID, setTypeID] = useState('');

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

  }, [])

  const matchingServiceType = (typeID) => {
    const matchedService = serviceList.find(service => service.typeID === typeID);
    return matchedService ? matchedService.typeName : 'ไม่พบข้อมูลบริการ';
  };

  return (
    <div>
      {requestList.map((request, index) => (
        <div key={index} className=' pb-4'>
          <div
            style={{
              backgroundColor: "#FFEAFC"
            }}
            className=' text-xl grid rounded-lg p-4 bg-slate-400'>
            <span className=' pb-4'>ชื่อบริการ: {matchingServiceType(request.typeID)}</span>
            <span className=' pb-4'>สาขา: {request.clinicID}</span>
            <span className=' pb-4'>วันที่นัดหมาย: {request.startTime}</span>
            <div>
              <button
                // onClick={() => AddRequest(service.typeID)}
                onClick={() => {
                  // setTypeID(service.typeID);
                }}
                className=' rounded-lg p-2' style={{
                  backgroundColor: '#FCFF79',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>เลือก</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CustomerIn_ProgressPage