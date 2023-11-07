import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Pagination from '../../components/pagination/Pagination';

function OwnerStoragesPage() {

  const [clinicList, setClinicList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [serviceInused, setServiceInused] = useState([]);
  const [serviceUnused, setServiceUnused] = useState([]);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const [filteredHistoryList, setFilteredHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredStorageList, setFilteredStorageList] = useState([]);
  const [searchTermStorage, setSearchTermStorage] = useState('');
  const [currentPageStorage, setCurrentPageStorage] = useState(1);
  const [itemsPerPageStorage] = useState(5);

  useEffect(() => {
    const isOwnerLogined = localStorage.getItem('isOwnerLogined');

    if (isOwnerLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/owner/login';
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
              <input
                type="text"
                placeholder="ค้นหาตามชื่ออุปกรณ์ หรือจำนวน"
                className="rounded-lg p-2 border border-gray-300 mb-4"
                value={searchTermStorage}
                onChange={handleSearchStorage}
              />
              <table className=' table-auto'>
                <thead style={{
                  backgroundColor: '#FFB2B2',
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
              <div className="pagination flex justify-center mt-4">
                <Pagination
                  totalItems={filteredStorageList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                  itemsPerPage={itemsPerPageStorage} // จำนวนรายการต่อหน้า
                  onPageChange={handlePageChangeStorage} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
                />  
              </div>
            </div>
            <h2 className=' text-2xl font-normal mt-4'>ประวัติการใช้สินค้า</h2>
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
                  backgroundColor: '#FFB2B2',
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
        )}
      </div>
    </div>
  )
}

export default OwnerStoragesPage