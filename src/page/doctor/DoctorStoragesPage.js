import React, { useEffect, useState } from 'react'
import { useDoctor } from '../../components/contexts/AdminContext'
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import Pagination from '../../components/pagination/Pagination';

function DoctorStoragesPage() {

  const { doctorDetail } = useDoctor();

  const [amount, setAmount] = useState('');
  const [itemID, setItemID] = useState('');

  const [ordered, setOrdered] = useState(false);
  const [isOrderVisible, setIsOrderVisible] = useState(false);

  const [orderList, setOrderList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectItem, setSelectItem] = useState([]);

  const [storageList, setStorageList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [serviceInused, setServiceInused] = useState([]);
  const [serviceUnused, setServiceUnused] = useState([]);

  const [filteredHistoryList, setFilteredHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredStorageList, setFilteredStorageList] = useState([]);
  const [searchTermStorage, setSearchTermStorage] = useState('');
  const [currentPageStorage, setCurrentPageStorage] = useState(1);
  const [itemsPerPageStorage] = useState(5);

  useEffect(() => {
    const isDoctorLogined = localStorage.getItem('isDoctorLogined');

    if (isDoctorLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/doctor/login';
    }

    const storedOrderList = localStorage.getItem('orderList');
    if (storedOrderList) {
      setOrderList(JSON.parse(storedOrderList));
    }

    const fetchStorageData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/storage', { params: { clinicID: doctorDetail.clinicID } });
        if (!data.error) {
          setStorageList(data.data)
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUseItemHistoryData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/useItemHistory', { params: { clinicID: doctorDetail.clinicID } });
        if (!data.error) {
          setHistoryList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'doctor/list', { params: { clinicID: doctorDetail.clinicID } });
        const responseData = response.data;
        if (!responseData.error) {
          setDoctorList(responseData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchServiceInusedData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: doctorDetail.clinicID } });
        const responseData = response.data;
        if (!responseData.error) {
          setServiceInused(responseData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchServiceUnusedData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/unused', { params: { clinicID: doctorDetail.clinicID } });
        const responseData = response.data;
        if (!responseData.error) {
          setServiceUnused(responseData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

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

    fetchStorageData();
    fetchUseItemHistoryData();
    fetchDoctorData();
    fetchServiceInusedData();
    fetchServiceUnusedData();
    fetchItemsData();

  }, [ordered]);

  const getFormattedDateAndItemName = (history) => {
    const matchingDoctor = doctorList.find(doctor => doctor.doctorID === history.doctorID);
    const doctorName = matchingDoctor ? matchingDoctor.name : '';
    const doctorSurname = matchingDoctor ? matchingDoctor.surname : '';

    const matchingServiceInused = serviceInused.find(service => service.typeID === history.typeID);
    const matchingServiceUnused = serviceUnused.find(service => service.typeID === history.typeID);
    // const serviceName = matchingServiceInused ? matchingServiceInused.typeName : '';
    const serviceName = matchingServiceInused ? matchingServiceInused.typeName : matchingServiceUnused ? matchingServiceUnused.typeName : '';

    const dateTime = new Date(history.time);
    dateTime.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC timezone

    const year = dateTime.getUTCFullYear();
    const month = String(dateTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return { formattedDate, doctorName, doctorSurname, serviceName };
  };

  useEffect(() => {
    const filteredList = historyList.filter(history => {
      const { formattedDate, doctorName, doctorSurname, serviceName } = getFormattedDateAndItemName(history);
      return (
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctorSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        history.amount.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredHistoryList(filteredList);
    setCurrentPage(1); // Reset to the first page when the search term changes

    const filteredStorageList = storageList.filter(storage => {
      return (
        storage.productName.toLowerCase().includes(searchTermStorage.toLowerCase()) ||
        storage.amount.toString().toLowerCase().includes(searchTermStorage.toLowerCase())
      );
    });
    setFilteredStorageList(filteredStorageList);
    setCurrentPageStorage(1); // Reset to the first page when the search term changes

  }, [historyList, doctorList, searchTerm, searchTermStorage, storageList]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistoryList.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastItemStorage = currentPageStorage * itemsPerPageStorage;
  const indexOfFirstItemStorage = indexOfLastItemStorage - itemsPerPageStorage;
  const currentItemsStorage = filteredStorageList.slice(indexOfFirstItemStorage, indexOfLastItemStorage);

  const renderStorageTableRows = (storageList) => {
    return storageList.map((storage, index) => {
      return (
        <tr key={`storage-${storage.productID}-${index}`}>
          <td style={{ textAlign: 'center' }}>{storage.productName}</td>
          <td style={{ textAlign: 'center' }}>{storage.amount}</td>
        </tr>
      );
    });
  };

  const renderHistoryTableRows = (historyList) => {
    return historyList.map((history, index) => {
      const { formattedDate, doctorName, doctorSurname, serviceName } = getFormattedDateAndItemName(history);
      const uniqueKey = `${history.productID}_${index}`; // Combine productID and index to create a unique key

      return (
        <tr key={uniqueKey}>
          <td style={{ textAlign: 'center' }}>{formattedDate}</td>
          <td style={{ textAlign: 'center' }}>{serviceName}</td>
          <td style={{ textAlign: 'center' }}>{doctorName}</td>
          <td style={{ textAlign: 'center' }}>{doctorSurname}</td>
          <td style={{ textAlign: 'center' }}>{history.productName}</td>
          <td style={{ textAlign: 'center' }}>{history.amount}</td>
        </tr>
      );
    });
  };

  const renderOrderTableRows = (orderList) => {
    return orderList.map((order, index) => {
      const matchingItem = itemList.find(item => item.itemID === order.itemID);
      const itemName = matchingItem ? matchingItem.itemName : '';

      return (
        <tr key={`order-${order.itemID}-${index}`}>
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
                }}>ใช้</button>
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
        doctorID: doctorDetail.doctorID,
        productID: itemID,
        amount: amount,
      };

      console.log(newOrder)

      // ส่งคำสั่งซื้อไปยัง API
      await axios.post(process.env.REACT_APP_API_URL + 'doctor/useItem', newOrder);

      // ทำการลบ itemID ออกจาก orderList
      const updatedOrderList = orderList.filter(order => order.itemID !== itemID);

      // อัปเดต orderList ใน state
      setOrderList(updatedOrderList);

      // บันทึกข้อมูลใน Local Storage
      localStorage.setItem('orderList', JSON.stringify(updatedOrderList));

      // แสดงแจ้งเตือนเสร็จสิ้น
      await Swal.fire({
        icon: 'success',
        title: 'เสร็จสิ้น',
        showConfirmButton: false,
        timer: 1000
      });

      setOrdered(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "คุณยังไม่มีการรักษา",
        text: "สามารถใช้อุปกรณ์เมื่อถึงเวลานัดหมายเท่านั้น",
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

  const handleSearchStorage = event => {
    setSearchTermStorage(event.target.value);
  };

  const handlePageChangeStorage = pageNumberStorage => {
    setCurrentPageStorage(pageNumberStorage);
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>อุปกรณ์ในคลัง</h1>
      <div>
        <div>
          <div className=' grid pb-4 pt-4'>
            <input
              type="text"
              placeholder="ค้นหาตามชื่ออุปกรณ์ หรือจำนวน"
              className="rounded-lg p-2 border border-gray-300 mb-4"
              value={searchTermStorage}
              onChange={handleSearchStorage}
            />
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#B2DAFF',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <tr>
                  <th style={{ textAlign: 'center' }}>ชื่ออุปกรณ์</th>
                  <th style={{ textAlign: 'center' }}>จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {renderStorageTableRows(currentItemsStorage)}
              </tbody>
            </table>
            <div className="pagination flex justify-center">
              <Pagination
                totalItems={filteredStorageList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                itemsPerPage={itemsPerPageStorage} // จำนวนรายการต่อหน้า
                onPageChange={handlePageChangeStorage} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
              />
            </div>
          </div>
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
                  }}>ใช้อุปกรณ์</button>
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
            <h2 className=' text-2xl font-normal mb-4'>อุปกรณ์ที่ต้องการ</h2>
            <div className=' grid pb-4 pt-4'>
              <table className=' table-auto'>
                <thead style={{
                  backgroundColor: '#B2DAFF',
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
          <h2 className=' text-2xl font-normal mt-4'>ประวัติการใช้อุปกรณ์</h2>
          <div className=' grid pb-4 pt-4'>
            <input
              type="text"
              placeholder="ค้นหาวันที่ใช้, ชื่อบริการ, ชื่อแพทย์, นามสกุลแพทย์, ชื่ออุปกรณ์, หรือจำนวน"
              className="rounded-lg p-2 border border-gray-300 mb-4"
              value={searchTerm}
              onChange={handleSearch}
            />
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#B2DAFF',
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
    </div>
  )
}

export default DoctorStoragesPage