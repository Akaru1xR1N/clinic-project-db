import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';

function OwnerOrderPage() {

  const [clinicList, setClinicList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const ToAddOrder = () => {

  };

  useEffect(() => {
    const isOwnerLogined = localStorage.getItem('isOwnerLogined');

    if (isOwnerLogined !== 'true') {
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
    }

    fetchClinicData();
  }, []);

  const onchangeClinic = async (clinicList) => {
    setIsTableVisible(true);
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'admin/list', { params: { clinicID: clinicList.value } });
      if (!data.error) {
        setOrderList(data.data)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderOrderTableRows = (orderList) => {
    return orderList.map(order => {
      return (
        <tr key={order.adminID}>
          <td style={{ textAlign: 'center' }}>{order.name}</td>
          <td style={{ textAlign: 'center' }}>{order.surname}</td>
          <td style={{ textAlign: 'center' }}>{order.email}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button
              // onClick={() => ToEditAdmin(admin.adminID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      )
    })
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>สั่งอุปกรณ์</h1>
      <div className=''>
        <div className=' flex place-content-end mr-14 space-x-4 pb-4'>
          <div className=''>
            <button onClick={ToAddOrder} className=' rounded-lg p-3' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>เพิ่มคำสั่งซื้อ</button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h2 className=' text-2xl font-normal mb-4'>ประวัติการสั่งซื้อสินค้า</h2>
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
          <div className=' grid pb-4 pt-4'>
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#FFB2B2',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <tr>
                  <th style={{ textAlign: 'center' }}>ชื่อ</th>
                  <th style={{ textAlign: 'center' }}>นามสกุล</th>
                  <th style={{ textAlign: 'center' }}>email</th>
                  <th style={{ textAlign: 'center' }}>การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {renderOrderTableRows(orderList)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OwnerOrderPage