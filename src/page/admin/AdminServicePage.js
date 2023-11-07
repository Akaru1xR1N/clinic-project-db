import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { useAdmin } from '../../components/contexts/AdminContext';
import Pagination from '../../components/pagination/Pagination';

function AdminServicePage() {

  const { adminDetail } = useAdmin();

  const [categoryID, setCategoryID] = useState('');

  const [serviceList, setServiceList] = useState([]);
  const [InusedCategory, setInusedCategory] = useState([]);
  const [UnusedCategory, setUnusedCategory] = useState([]);

  const [isTableInusedVisible, setIsTableInusedVisible] = useState(false);
  const [isTableUnusedVisible, setIsTableUnusedVisible] = useState(false);
  const [isServiceVisible, setIsServiceVisible] = useState(false);

  const [deleted, setDeleted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [closed, setClosed] = useState(false);

  const [filteredInusedCategoryList, setFilteredInusedCategoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredUnusedCategoryList, setFilteredUnusedCategoryList] = useState([]);
  const [searchTermUnused, setSearchTermUnused] = useState('');
  const [currentPageUnused, setCurrentPageUnused] = useState(1);
  const [itemsPerPageUnused] = useState(5);

  const ToAddService = () => {
    window.location.href = '/admin/add/service';
  };

  useEffect(() => {
    const isAdminLogined = localStorage.getItem('isAdminLogined');

    if (isAdminLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/admin/login';
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

    const fetchCategoryUnused = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/category/unused');
        if (!data.error) {
          setUnusedCategory(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategoryInused();
    fetchCategoryUnused();
  }, [deleted, opened, closed]);

  useEffect(() => {
    const filteredInusedList = InusedCategory.filter(inUsed => {
      return (
        inUsed.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredInusedCategoryList(filteredInusedList);
    setCurrentPage(1); // Reset to the first page when the search term changes

    const filteredUnusedList = UnusedCategory.filter(unUsed => {
      return (
        unUsed.categoryName.toLowerCase().includes(searchTermUnused.toLowerCase())
      );
    });
    setFilteredUnusedCategoryList(filteredUnusedList);
    setCurrentPageUnused(1); // Reset to the first page when the search term changes

  }, [InusedCategory, searchTerm, UnusedCategory, searchTermUnused]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInusedCategoryList.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastItemUnused = currentPageUnused * itemsPerPageUnused;
  const indexOfFirstItemUnused = indexOfLastItemUnused - itemsPerPageUnused;
  const currentItemsUnused = filteredUnusedCategoryList.slice(indexOfFirstItemUnused, indexOfLastItemUnused);

  const toggleTableInusedVisibility = () => {
    setIsTableInusedVisible(!isTableInusedVisible);
  };

  const toggleTableUnusedVisibility = () => {
    setIsTableUnusedVisible(!isTableUnusedVisible);
  };

  const toggleServiceVisibility = async (categoryID) => {
    setIsServiceVisible(true);
    setCategoryID(categoryID);
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/service/type/inused', { params: { clinicID: adminDetail.clinicID } });
      if (!data.error) {
        setServiceList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeInformation = () => {
    setIsServiceVisible(false);
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
                onClick={() => toggleServiceVisibility(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
              <button
                onClick={() => ChangeToClose(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const renderUnusedTableRows = (UnusedCategory) => {
    return UnusedCategory.map(category => {
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
                onClick={() => toggleServiceVisibility(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
              <button
                onClick={() => ChangeToOpen(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
                </svg>
              </button>
              <button
                onClick={() => deletedCategory(category.categoryID)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const ChangeToClose = async (categoryID) => {
    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการปิดให้บริการใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        setClosed(false)
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic/service/category', { data: { categoryID: categoryID } });
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'ปิดให้บริการ',
                showConfirmButton: false,
                timer: 1500
              });
              setClosed(true);
            } else {
              console.error('ERROR FOUND');
            }
          } catch (error) {
            console.error(error);
          }
        }
      })
  };

  const deletedCategory = async (categoryID) => {
    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการลบหมวดหมู่ใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        setDeleted(false);
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic/service/category', { data: { categoryID: categoryID } });
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'ลบหมวดหมู่เสร็จสิ้น',
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
      })
  };

  const ChangeToOpen = async (categoryID) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'ต้องการเปิดให้บริการใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(process.env.REACT_APP_API_URL + 'clinic/service/category/bringback', { categoryID: categoryID });
        if (response.status === 200) {
          await Swal.fire({
            icon: 'success',
            title: 'เปิดให้บริการ',
            showConfirmButton: false,
            timer: 1500
          });
          setOpened(true);
        } else {
          console.error("ERROR FOUND")
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setOpened(false);
    }
  };

  const ToEditServiceType = (typeID) => {
    window.location.href = '/admin/edit/service/' + typeID;
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchUnused = event => {
    setSearchTermUnused(event.target.value);
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handlePageChangeUnused = pageNumberUnused => {
    setCurrentPageUnused(pageNumberUnused);
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>จัดการบริการ</h1>
      <div className=''>
        <div className=' flex flex-row-reverse mr-14 space-x-4'>
          <div className=''>
            <button onClick={ToAddService} className=' rounded-lg p-3' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>เพิ่มบริการ</button>
          </div>
        </div>
      </div>
      <div>
        <h2 className=' text-3xl font-normal pb-4'>หมวดหมู่ของบริการ</h2>
      </div>
      <div>
        <div className=' flex space-x-4 mb-4'>
          <h2 className=' text-2xl font-normal'>เปิดให้บริการ</h2>
          <button onClick={toggleTableInusedVisibility}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              {isTableInusedVisible ? (
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
              )}
            </svg>
          </button>
        </div>
        {isTableInusedVisible && (
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
                backgroundColor: '#FFD7B2',
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
        )}
      </div>
      <div>
        <div className=' flex space-x-4 mb-4'>
          <h2 className=' text-2xl font-normal'>ปิดให้บริการ</h2>
          <button onClick={toggleTableUnusedVisibility}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              {isTableUnusedVisible ? (
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
              )}
            </svg>
          </button>
        </div>
        {isTableUnusedVisible && (
          <div className=' grid mb-4'>
            <input
              type="text"
              placeholder="ค้นหาตามชื่อ"
              className="rounded-lg p-2 border border-gray-300 mb-4"
              value={searchTermUnused}
              onChange={handleSearchUnused}
            />
            <table className=' table-auto'>
              <thead style={{
                backgroundColor: '#FFD7B2',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <tr>
                  <th style={{ textAlign: 'center' }}>ชื่อ</th>
                  <th style={{ textAlign: 'center' }}>การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {renderUnusedTableRows(currentItemsUnused)}
              </tbody>
            </table>
            <div className="pagination flex justify-center mt-4">
              <Pagination
                totalItems={filteredUnusedCategoryList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                itemsPerPage={itemsPerPageUnused} // จำนวนรายการต่อหน้า
                onPageChange={handlePageChangeUnused} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
              />
            </div>
          </div>
        )}
      </div>
      <div className=' pb-4'>
        {isServiceVisible && (
          <div>
            <div className=' flex space-x-4 mb-4'>
              <span className=' text-2xl font-normal'>สาขา</span>
              <button onClick={closeInformation}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {serviceList
              .filter(service => service.categoryID === categoryID)
              .map(service => (
                <div key={service.typeID} className=' pb-4'>
                  <div
                    style={{
                      backgroundColor: "#FFF7EA"
                    }}
                    className=' text-xl grid rounded-lg p-4 bg-slate-400'>
                    <span className=' pb-4'>ชื่อบริการ: {service.typeName}</span>
                    <span className=' pb-4'>ระยะเวลา: {service.duration}</span>
                    <span className=' pb-4'>ราคา: {service.price} บาท</span>
                    <div>
                      <button onClick={() => ToEditServiceType(service.typeID)} className=' rounded-lg p-2' style={{
                        backgroundColor: '#FCFF79',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                      }}>แก้ไข</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminServicePage