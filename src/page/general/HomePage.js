import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Pagination from '../../components/pagination/Pagination';

function HomePage() {

  const [categoryID, setCategoryID] = useState('');
  const [clinicID, setClinicID] = useState('');
  const [typeID, setTypeID] = useState('');
  const [data, setData] = useState('');

  const [clinicList, setClinicList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [InusedCategory, setInusedCategory] = useState([]);

  const [isInformationVisible, setIsInformaionVisible] = useState(false);
  const [isServiceVisible, setIsServiceVisible] = useState(false);

  const [filteredInusedCategoryList, setFilteredInusedCategoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
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

  useEffect(() => {
    const filteredInusedList = InusedCategory.filter(inUsed => {
      return (
        inUsed.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredInusedCategoryList(filteredInusedList);
    setCurrentPage(1); // Reset to the first page when the search term changes

  }, [InusedCategory, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInusedCategoryList.slice(indexOfFirstItem, indexOfLastItem);

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

  const ToCustomerLogin = () => {
    window.location.href = '/login';
  };
  const ToSignup = () => {
    window.location.href = '/signup';
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className=' flex flex-row-reverse p-7 bg-gray-50'>
        <div className=' flex space-x-4 underline'>
          <button onClick={ToCustomerLogin}>Login</button>
          <button onClick={ToSignup}>Signup</button>
        </div>
      </div>
      <div className=' p-7'>
        <h1 className=' text-4xl font-normal text-center p-7'>บริการของเรา</h1>
        <div>
          <h2 className=' text-3xl font-normal pb-4'>หมวดหมู่ของบริการ</h2>
        </div>
        <div>
          <div className=' grid pb-4'>
            <input
              type="text"
              placeholder="ค้นหาตามชื่อ"
              className="rounded-lg p-2 border border-gray-300 mb-4"
              value={searchTerm}
              onChange={handleSearch}
            />
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
                {renderInusedTableRows(currentItems)}
              </tbody>
            </table>
            <div className="pagination flex justify-center mt-4">
              <Pagination
                totalItems={filteredInusedCategoryList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                itemsPerPage={itemsPerPage} // จำนวนรายการต่อหน้า
                onPageChange={handlePageChange} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
              />
            </div>
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
                          onClick={ToCustomerLogin}
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
        </div>
      </div>
    </div>
  )
}

export default HomePage