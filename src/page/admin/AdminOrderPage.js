import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Popup from 'reactjs-popup';

function AdminOrderPage() {

  const [amount, setAmount] = useState('');
  const [itemID, setItemID] = useState('');

  const [clinicList, setClinicList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectItem, setSelectItem] = useState([]);

  const [isTableVisible, setIsTableVisible] = useState(false);
  const [isOrderVisible, setIsOrderVisible] = useState(false);

  useEffect(() => {
    const isAdminLogined = localStorage.getItem('isAdminLogined');

    if (isAdminLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/admin/login';
    }

    // ตรวจสอบว่ามีข้อมูลใน Local Storage หรือไม่
    const storedOrderList = localStorage.getItem('orderList');
    if (storedOrderList) {
      setOrderList(JSON.parse(storedOrderList));
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
    const fetchItemsData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/items');
        const responseData = response.data;
        if (!responseData.error) {
          setItemList(responseData.data);
          const options = responseData.data.map(item => ({
            value: item.itemID,
            label: item.itemName,
            itemID: item.itemID
          }))
          setSelectItem(options);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClinicData();
    fetchItemsData();
  }, []);

  const renderOrderTableRows = (orderList) => {
    return orderList.map((order, index) => {
      const matchingItem = itemList.find(item => item.itemID === order.itemID);
      const itemName = matchingItem ? matchingItem.itemName : '';

      return (
        <tr key={index}>
          <td style={{ textAlign: 'center' }}>{itemName}</td>
          <td style={{ textAlign: 'center' }}>{order.amount}</td>
        </tr>
      );
    });
  };

  const renderHistoryTableRows = (historyList) => {
    return historyList.map(history => {
      return (
        <tr key={history.adminID}>
          <td style={{ textAlign: 'center' }}>{history.name}</td>
          <td style={{ textAlign: 'center' }}>{history.surname}</td>
          <td style={{ textAlign: 'center' }}>{history.email}</td>
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

  const PreOrder = () => {
    // ตรวจสอบว่า itemID และ amount ถูกกรอกหรือไม่
    if (itemID && amount) {
      // สร้างออบเจ็กต์ใหม่เพื่อเก็บข้อมูล
      const newOrder = {
        itemID: itemID,
        amount: parseInt(amount)
      };
  
      // เพิ่มข้อมูลลงใน orderList โดยใช้ spread operator
      const updatedOrderList = [...orderList, newOrder];
  
      // บันทึกข้อมูลใน Local Storage
      localStorage.setItem('orderList', JSON.stringify(updatedOrderList));
  
      // อัปเดต orderList ใน state
      setOrderList(updatedOrderList);
  
      // ปิด Popup
      setIsOrderVisible(false);
    } else {
      // แจ้งเตือนให้กรอกข้อมูลให้ครบถ้วน
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };
  

  const onchangeItem = async (selectedItem) => {
    // ตรวจสอบว่า selectedItem ไม่ใช่ null และมี property itemID
    if (selectedItem && selectedItem.itemID) {
      setItemID(selectedItem.itemID);
    } else {
      // กรณีไม่พบ itemID ใน selectedItem
      setItemID('');
    }
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>สั่งอุปกรณ์</h1>
      <div className=''>
        <div className=' flex place-content-end mr-14 space-x-4 pb-4'>
          <div className=''>
            <button onClick={() => {
              setIsOrderVisible(true)
              setAmount('');
            }}
              className=' rounded-lg p-3' style={{
                backgroundColor: '#ACFF79',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
              }}>เพิ่มคำสั่งซื้อ</button>
            <Popup
              trigger={null}
              open={isOrderVisible}
              onClose={() => setIsOrderVisible(false)}
              contentStyle={{
                width: 400,
              }}>
              <div className=' grid pb-4 place-items-center'>
                <span className=' text-2xl font-normal mb-4'>เลือกอุปกรณ์ที่ต้องการ</span>
                <div className=' grid pb-4'>
                  <span className=' text-xl font-normal mb-4'>รายชื่ออุปกรณ์</span>
                  <Select className=' w-full'
                    options={selectItem}
                    onChange={onchangeItem}
                    placeholder='---โปรดระบุชื่ออุปกรณ์---'>
                  </Select>
                </div>
                <div className=' grid pb-4'>
                  <span className=' text-xl font-normal mb-4'>จำนวน</span>
                  <input className=' border-2 border-black rounded-full w-full py-3 px-6'
                    onChange={(event) => {
                      setAmount(event.target.value);
                    }}
                    value={amount}
                    type='number'
                  />
                </div>
                <button onClick={PreOrder} className=' rounded-lg px-2 py-2 mt-4' style={{
                  backgroundColor: '#ACFF79',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>เลือก
                </button>
              </div>
            </Popup>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h2 className=' text-2xl font-normal mb-4'>คำสั่งซื้อที่ต้องการ</h2>
          <div className=' grid pb-4 pt-4'>
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#FFD7B2',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <tr>
                  <th style={{ textAlign: 'center' }}>ชื่ออุปกรณ์</th>
                  <th style={{ textAlign: 'center' }}>จำนวน</th>
                  <th style={{ textAlign: 'center' }}>การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {renderOrderTableRows(orderList)}
              </tbody>
            </table>
          </div>
        </div>
        {isTableVisible && (
          <div className=' grid pb-4 pt-4'>
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#FFD7B2',
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

export default AdminOrderPage