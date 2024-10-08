import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Popup from 'reactjs-popup';
import { useAdmin } from '../../components/contexts/AdminContext';
import Swal from 'sweetalert2';
import Pagination from '../../components/pagination/Pagination';

function AdminOrderPage() {

  const { adminDetail } = useAdmin();

  const [adminID, setAdminID] = useState('');
  const [clinicID, setClinicID] = useState('');

  const [amount, setAmount] = useState('');
  const [itemID, setItemID] = useState('');

  const [ordered, setOrdered] = useState(false);

  const [orderList, setOrderList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectItem, setSelectItem] = useState([]);
  const [adminList, setAdminList] = useState([]);

  const [isOrderVisible, setIsOrderVisible] = useState(false);

  const [filteredHistoryList, setFilteredHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

    if (adminDetail) {
      setAdminID(adminDetail.adminID);
      setClinicID(adminDetail.clinicID);
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
    const fetchOrderHistory = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'admin/orderHistory');
        if (!data.error) {
          setHistoryList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'admin/list', { params: { clinicID: adminDetail.clinicID } });
        if (!data.error) {
          setAdminList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchItemsData();
    fetchOrderHistory();
    fetchAdminData();

  }, [ordered]);

  const getFormattedDateAndItemName = (history) => {
    const matchingAdmin = adminList.find(admin => admin.adminID === history.adminID);
    const adminName = matchingAdmin ? matchingAdmin.name : '';
    const adminSurname = matchingAdmin ? matchingAdmin.surname : '';

    const dateTime = new Date(history.time);
    dateTime.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC timezone

    const year = dateTime.getUTCFullYear();
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const matchingItem = itemList.find(item => item.itemID === history.itemID);
    const itemName = matchingItem ? matchingItem.itemName : '';

    return { formattedDate, adminName, adminSurname, itemName };
  };

  useEffect(() => {
    const filteredList = historyList.filter(history => {
      const { formattedDate, adminName, adminSurname, itemName } = getFormattedDateAndItemName(history);
      return (
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adminSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.amount.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.totalPrice.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredHistoryList(filteredList);
    setCurrentPage(1); // Reset to the first page when the search term changes

  }, [historyList, adminList, searchTerm, itemList,]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistoryList.slice(indexOfFirstItem, indexOfLastItem);

  const renderOrderTableRows = (orderList) => {
    return orderList.map((order, index) => {
      const matchingItem = itemList.find(item => item.itemID === order.itemID);
      const itemName = matchingItem ? matchingItem.itemName : '';

      return (
        <tr key={index}>
          <td style={{ textAlign: 'center' }}>{itemName}</td>
          <td style={{ textAlign: 'center' }}>{order.amount}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button onClick={() => handleDeleteOrder(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
              <button onClick={() => AddOrder(order.itemID, order.amount)}
                className=' rounded-lg p-1.5' style={{
                  backgroundColor: '#ACFF79',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                }}>สั่งซื้อ</button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const handleDeleteOrder = (index) => {
    // คัดลอก orderList ทั้งหมด
    const updatedOrderList = [...orderList];
    // ลบข้อมูลที่ต้องการจาก index ที่ระบุ
    updatedOrderList.splice(index, 1);

    // อัปเดต orderList ใน state
    setOrderList(updatedOrderList);

    // บันทึกข้อมูลใน Local Storage
    localStorage.setItem('orderList', JSON.stringify(updatedOrderList));
  };

  const renderHistoryTableRows = (historyList) => {
    return historyList.map((history, index) => {
      const { formattedDate, adminName, adminSurname, itemName } = getFormattedDateAndItemName(history);
      const uniqueKey = `${history.productID}_${index}`; // Combine productID and index to create a unique key

      return (
        <tr key={uniqueKey}>
          <td style={{ textAlign: 'center' }}>{formattedDate}</td>
          <td style={{ textAlign: 'center' }}>{adminName}</td>
          <td style={{ textAlign: 'center' }}>{adminSurname}</td>
          <td style={{ textAlign: 'center' }}>{itemName}</td>
          <td style={{ textAlign: 'center' }}>{history.amount}</td>
          <td style={{ textAlign: 'center' }}>{history.totalPrice}</td>
        </tr>
      );
    });
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

  const AddOrder = async (itemID, amount) => {
    try {
      const newOrder = {
        adminID: adminID,
        clinicID: clinicID,
        itemID: itemID,
        amount: amount,
      };

      // ส่งคำสั่งซื้อไปยัง API
      await axios.post(process.env.REACT_APP_API_URL + 'admin/order', newOrder);

      // ทำการลบ itemID ออกจาก orderList
      const updatedOrderList = orderList.filter(order => order.itemID !== itemID);

      // อัปเดต orderList ใน state
      setOrderList(updatedOrderList);

      // บันทึกข้อมูลใน Local Storage
      localStorage.setItem('orderList', JSON.stringify(updatedOrderList));

      // แสดงแจ้งเตือนเสร็จสิ้น
      await Swal.fire({
        icon: 'success',
        title: 'สั่งซื้อเสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });

      setOrdered(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "โปรดตรวจสอบข้อมูล",
        showConfirmButton: false,
        timer: 2000
      });
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

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
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
        <h2 className=' text-2xl font-normal mt-4'>ประวัติการสั่งซื้อ</h2>
        <div className=' grid pb-4 pt-4'>
          <input
            type="text"
            placeholder="ค้นหาวันที่สั่ง, ชื่อผู้สั่ง, นามสกุลผู้สั่ง, ชื่ออุปกรณ์, จำนวน, หรือราคา"
            className="rounded-lg p-2 border border-gray-300 mb-4"
            value={searchTerm}
            onChange={handleSearch}
          />
          <table className=' table-auto'>
            <thead style={{
              backgroundColor: '#FFD7B2',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <tr>
                <th style={{ textAlign: 'center' }}>วันที่สั่ง</th>
                <th style={{ textAlign: 'center' }}>ชื่อ</th>
                <th style={{ textAlign: 'center' }}>นามสกุล</th>
                <th style={{ textAlign: 'center' }}>ชื่ออุปกรณ์</th>
                <th style={{ textAlign: 'center' }}>จำนวน</th>
                <th style={{ textAlign: 'center' }}>ราคา</th>
              </tr>
            </thead>
            <tbody>
              {renderHistoryTableRows(currentItems)}
            </tbody>
          </table>
          <div className="pagination flex justify-center mt-4">
            <Pagination
              totalItems={filteredHistoryList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
              itemsPerPage={itemsPerPage} // จำนวนรายการต่อหน้า
              onPageChange={handlePageChange} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderPage