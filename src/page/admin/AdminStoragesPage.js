import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { useAdmin } from '../../components/contexts/AdminContext';

function AdminStoragesPage() {

  const { adminDetail } = useAdmin();

  const [clinicList, setClinicList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [serviceInused, setServiceInused] = useState([]);
  const [serviceUnused, setServiceUnused] = useState([]);

  const [isTableVisible, setIsTableVisible] = useState(false);

  useEffect(() => {
    const isAdminLogined = localStorage.getItem('isAdminLogined');

    if (isAdminLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/admin/login';
    }

    const fetchClinicData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
        const responseData = response.data;
        if (!responseData.error) {
          const options = responseData.data.map(clinic => ({
            value: clinic.clinicID,
            label: clinic.name,
          }))
          setClinicList(options);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClinicData();
  }, []);

  const onchangeClinic = async (clinicList) => {
    setIsTableVisible(true);
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/storage', { params: { clinicID: clinicList.value } });
      if (!data.error) {
        setStorageList(data.data)
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/useItemHistory', { params: { clinicID: clinicList.value } });
      if (!data.error) {
        setHistoryList(data.data);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'doctor/list', { params: { clinicID: clinicList.value } });
      const responseData = response.data;
      if (!responseData.error) {
        setDoctorList(responseData.data);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: clinicList.value } });
      const responseData = response.data;
      if (!responseData.error) {
        setServiceInused(responseData.data);
      }
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/unused', { params: { clinicID: clinicList.value } });
      const responseData = response.data;
      if (!responseData.error) {
        setServiceUnused(responseData.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderStorageTableRows = (storageList) => {
    return storageList.map(storage => {
      return (
        <tr key={storage.productID}>
          <td style={{ textAlign: 'center' }}>{storage.productName}</td>
          <td style={{ textAlign: 'center' }}>{storage.amount}</td>
        </tr>
      )
    })
  };

  const renderHistoryTableRows = (historyList) => {
    return historyList.map(history => {
      const matchingDoctor = doctorList.find(doctor => doctor.doctorID === history.doctorID);
      const doctorName = matchingDoctor ? matchingDoctor.name : '';
      const doctorSurname = matchingDoctor ? matchingDoctor.surname : '';
      const matchingServiceInused = serviceInused.find(service => service.typeID === history.typeID);
      const matchingServiceUnused = serviceUnused.find(service => service.typeID === history.typeID);
      // const serviceName = matchingServiceInused ? matchingServiceInused.typeName : '';
      const serviceName = matchingServiceInused ? matchingServiceInused.typeName : matchingServiceUnused ? matchingServiceUnused.typeName : '';

      const dateTime = new Date(history.time);
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;


      return (
        <tr key={history.productID}>
          <td style={{ textAlign: 'center' }}>{formattedDate}</td>
          <td style={{ textAlign: 'center' }}>{serviceName}</td>
          <td style={{ textAlign: 'center' }}>{doctorName}</td>
          <td style={{ textAlign: 'center' }}>{doctorSurname}</td>
          <td style={{ textAlign: 'center' }}>{history.productName}</td>
          <td style={{ textAlign: 'center' }}>{history.amount}</td>
        </tr>
      )
    })
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>อุปกรณ์ในคลัง</h1>
      <div>
        <div>
          <div className=' grid pb-4'>
            <span className=' text-xl font-normal mb-4'>สาขา</span>
            <Select className=' w-2/5'
              options={clinicList}
              onChange={onchangeClinic}
              placeholder='---โปรดระบุชื่อสาขา---'>
            </Select>
          </div>
        </div>
        {isTableVisible && (
          <div>
            <div className=' grid pb-4 pt-4'>
              <table className=' table-auto'>
                <thead style={{
                  backgroundColor: '#FFD7B2',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <tr>
                    <th style={{ textAlign: 'center' }}>ชื่ออุปกรณ์</th>
                    <th style={{ textAlign: 'center' }}>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {renderStorageTableRows(storageList)}
                </tbody>
              </table>
            </div>
            <h2 className=' text-2xl font-normal mt-4'>ประวัติการใช้สินค้า</h2>
            <div className=' grid pb-4 pt-4'>
              <table className=' table-auto'>
                <thead style={{
                  backgroundColor: '#FFD7B2',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <tr>
                    <th style={{ textAlign: 'center' }}>วันที่ใช้</th>
                    <th style={{ textAlign: 'center' }}>ชื่อบริการ</th>
                    <th style={{ textAlign: 'center' }}>ชื่อ</th>
                    <th style={{ textAlign: 'center' }}>นามสกุล</th>
                    <th style={{ textAlign: 'center' }}>ชื่ออุปกรณ์</th>
                    <th style={{ textAlign: 'center' }}>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {renderHistoryTableRows(historyList)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStoragesPage