import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Popup from 'reactjs-popup';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { useCustomer } from '../../components/contexts/AdminContext';

function CustomerHomePage() {

  const { customerDetail } = useCustomer();

  const [categoryID, setCategoryID] = useState('');
  const [clinicID, setClinicID] = useState('');
  const [typeID, setTypeID] = useState('');
  const [data, setData] = useState('');

  const [clinicList, setClinicList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [InusedCategory, setInusedCategory] = useState([]);

  const [isInformationVisible, setIsInformaionVisible] = useState(false);
  const [isServiceVisible, setIsServiceVisible] = useState(false);
  const [isRequestVisible, setIsRequestVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('08:30');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const isCustomerLogined = localStorage.getItem('isCustomerLogined');

    if (isCustomerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/login';
    }

    const fetchCategoryInused = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/inused');
        if (!data.error) {
          setInusedCategory(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchClinicData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
        const responseData = response.data;
        if (!responseData.error) {
          const options = responseData.data.map(clinic => ({
            value: clinic.clinicID,
            label: clinic.name,
            clinicID: clinic.clinicID
          }))
          setClinicList(options);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategoryInused();
    fetchClinicData();
  }, []);

  const toggleInfomationVisibility = (categoryID) => {
    setIsInformaionVisible(true);
    setCategoryID(categoryID);
  };

  const closeInformation = () => {
    setIsInformaionVisible(false);
    setServiceList([]);
  };

  const renderInusedTableRows = (InusedCategory) => {
    return InusedCategory.map(category => {
      return (
        <tr key={category.categoryID}>
          <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button
                onClick={() => toggleInfomationVisibility(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const onchangeClinic = async (clinicList) => {
    setIsServiceVisible(true);
    setClinicID(clinicList.clinicID);
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: clinicList.value } });
      if (!data.error) {
        setServiceList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const AddRequest = async (typeID) => {
    // รวมวันที่และเวลาเข้าด้วยกัน
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    selectedDateTime.setHours(hours, minutes);

    // เพิ่ม 1 เพื่อเป็นเดือน และเพิ่ม 543 เพื่อเป็นปี ในที่นี้เป็นตัวอย่างที่ใช้งานในภูมิภาคเอเชีย (เพิ่มเติมตามความต้องการของคุณ)
    selectedDateTime.setMonth(selectedDateTime.getMonth() + 1);
    selectedDateTime.setFullYear(selectedDateTime.getFullYear());

    // แปลง selectedDateTime เป็นรูปแบบ "YYYY-MM-DD hh:mm:ss"
    const formattedDate = `${selectedDateTime.getFullYear()}-${String(selectedDateTime.getMonth()).padStart(2, '0')}-${String(selectedDateTime.getDate()).padStart(2, '0')} ${String(selectedDateTime.getHours()).padStart(2, '0')}:${String(selectedDateTime.getMinutes()).padStart(2, '0')}:${String(selectedDateTime.getSeconds()).padStart(2, '0')}`;


    const newRequest = {
      clinicID: clinicID,
      customerID: customerDetail.customerID,
      typeID: typeID,
      startTime: formattedDate // เก็บเวลาในรูปแบบ ISO 8601
    };

    try {
      await axios.post(process.env.REACT_APP_API_URL + 'customer/serviceRequest', newRequest);
      setData([...data, newRequest]);
      await Swal.fire({
        icon: 'success',
        title: 'ส่งคำขอเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      })
      setIsRequestVisible(false);
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
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>บริการของเรา</h1>
      <div>
        <h2 className=' text-3xl font-normal pb-4'>หมวดหมู่ของบริการ</h2>
      </div>
      <div>
        <div className=' grid pb-4'>
          <table className=' table-auto'>
            <thead style={{
              backgroundColor: '#FFB2F3',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <tr>
                <th style={{ textAlign: 'center' }}>ชื่อ</th>
                <th style={{ textAlign: 'center' }}>การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {renderInusedTableRows(InusedCategory)}
            </tbody>
          </table>
        </div>
      </div>
      <div className=' pb-4'>
        {isInformationVisible && (
          <div className=''>
            <div className=' flex space-x-4 mb-4'>
              <span className=' text-2xl font-normal'>สาขา</span>
              <button onClick={closeInformation}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className=' grid pb-4'>
              <Select className=' w-2/5'
                options={clinicList}
                onChange={onchangeClinic}
                placeholder='---โปรดระบุชื่อสาขา---'>
              </Select>
            </div>
          </div>
        )}
        {isServiceVisible && (
          <div>
            {serviceList
              .filter(service => service.categoryID === categoryID)
              .map(service => (
                <div key={service.typeID} className=' pb-4'>
                  <div
                    style={{
                      backgroundColor: "#FFEAFC"
                    }}
                    className=' text-xl grid rounded-lg p-4 bg-slate-400'>
                    <span className=' pb-4'>ชื่อบริการ: {service.typeName}</span>
                    <span className=' pb-4'>ระยะเวลา: {service.duration}</span>
                    <span className=' pb-4'>ราคา: {service.price} บาท</span>
                    <div>
                      <button
                        // onClick={() => AddRequest(service.typeID)}
                        onClick={() => {
                          setIsRequestVisible(true);
                          setTypeID(service.typeID);
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
        )}
        <Popup
          trigger={null}
          open={isRequestVisible}
          onClose={() => setIsRequestVisible(false)}
          contentStyle={{
            width: 400,
          }}>
          <div className=' grid pb-4 place-items-center'>
            <span className=' text-xl font-normal mb-4'>เลือกวันที่ต้องการนัดหมาย</span>
            <div className="flex flex-col space-y-2">
              <label htmlFor="date-picker" className="text-sm font-medium text-gray-600">เลือกวันที่:</label>
              <DatePicker id="date-picker" selected={selectedDate} onChange={handleDateChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" />
              <label htmlFor="time-picker" className="text-sm font-medium text-gray-600">เลือกเวลา:</label>
              <TimePicker id="time-picker" value={selectedTime} onChange={handleTimeChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500" />
            </div>
            <button onClick={() => AddRequest(typeID)} className=' rounded-lg px-2 py-2 mt-4' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>ส่งคำขอ
            </button>
          </div>
        </Popup>
      </div>
    </div>
  )
}

export default CustomerHomePage