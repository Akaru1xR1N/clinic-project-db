import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import Pagination from '../../components/pagination/Pagination';

function OwnerUserManagementPage() {

  const [adminList, setAdminList] = useState([]);
  const [clinicList, setClinicList] = useState([]);
  const [ownerList, setOwnerList] = useState([]);

  const [filteredOwnerList, setFilteredOwnerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [filteredAdminList, setFilteredAdminList] = useState([]);
  const [searchTermAdmin, setSearchTermAdmin] = useState('');
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const [itemsPerPageAdmin] = useState(5);

  const [isTableVisible, setIsTableVisible] = useState(false);

  const ToAddAdmin = () => {
    window.location.href = '/owner/add/admin';
  };

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
    }

    const fetchOwnerData = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'owner/list');
        if (!data.error) {
          setOwnerList(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };


    fetchClinicData();
    fetchOwnerData();
  }, []);

  useEffect(() => {
    const filteredList = ownerList.filter(owner => {
      return (
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredOwnerList(filteredList);
    setCurrentPage(1); // Reset to the first page when the search term changes

    const filteredAdminList = adminList.filter(admin => {
      return (
        admin.name.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
        admin.surname.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTermAdmin.toLowerCase())
      );
    });
    setFilteredAdminList(filteredAdminList);
    setCurrentPageAdmin(1); // Reset to the first page when the search term changes

  }, [ownerList, searchTerm, adminList, searchTermAdmin]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOwnerList.slice(indexOfFirstItem, indexOfLastItem);

  const indexOfLastItemAdmin = currentPageAdmin * itemsPerPageAdmin;
  const indexOfFirstItemAdmin = indexOfLastItemAdmin - itemsPerPageAdmin;
  const currentItemsAdmin = filteredAdminList.slice(indexOfFirstItemAdmin, indexOfLastItemAdmin);

  const ToEditAdmin = (adminID) => {
    window.location.href = '/owner/edit/admin/' + adminID;
  };

  const renderAdminTableRows = (adminList) => {
    return adminList.map(admin => {
      return (
        <tr key={admin.adminID}>
          <td style={{ textAlign: 'center' }}>{admin.name}</td>
          <td style={{ textAlign: 'center' }}>{admin.surname}</td>
          <td style={{ textAlign: 'center' }}>{admin.email}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button onClick={() => ToEditAdmin(admin.adminID)}>
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

  const ToeditOwner = (ownerID) => {
    window.location.href = '/owner/edit/owner/' + ownerID;
  };

  const renderOwnerTableRows = (ownerList) => {
    return ownerList.map(owner => {
      return (
        <tr key={owner.ownerID}>
          <td style={{ textAlign: 'center' }}>{owner.name}</td>
          <td style={{ textAlign: 'center' }}>{owner.surname}</td>
          <td style={{ textAlign: 'center' }}>{owner.email}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button onClick={() => ToeditOwner(owner.ownerID)}>
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

  const onchangeClinic = async (clinicList) => {
    setIsTableVisible(true);
    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'admin/list', { params: { clinicID: clinicList.value } });
      if (!data.error) {
        setAdminList(data.data)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ToAddOwner = () => {
    window.location.href = '/owner/add/owner';
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchAdmin = event => {
    setSearchTermAdmin(event.target.value);
  };

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handlePageChangeAdmin = pageNumberAdmin => {
    setCurrentPageAdmin(pageNumberAdmin);
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>จัดการผู้ใช้</h1>
      <div className=''>
        <div className=' flex place-content-end mr-14 space-x-4 pb-4'>
          <div className=''>
            <button onClick={ToAddOwner} className=' rounded-lg p-3' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>เพิ่มเจ้าของ</button>
          </div>
          <div className=''>
            <button onClick={ToAddAdmin} className=' rounded-lg p-3' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>เพิ่มผู้ดูแลระบบ</button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h2 className=' text-2xl font-normal mb-4'>รายชื่อผู้ดูแลระบบ</h2>
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
            <input
              type="text"
              placeholder="ค้นหาตามชื่อ, นามสกุล, หรืออีเมล"
              className="rounded-lg p-2 border border-gray-300 mb-4"
              value={searchTermAdmin}
              onChange={handleSearchAdmin}
            />
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
                {renderAdminTableRows(currentItemsAdmin)}
              </tbody>
            </table>
            <div className="pagination flex justify-center mt-4">
              <Pagination
                totalItems={filteredAdminList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
                itemsPerPage={itemsPerPageAdmin} // จำนวนรายการต่อหน้า
                onPageChange={handlePageChangeAdmin} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <h2 className=' text-2xl font-normal'>รายชื่อเจ้าของ</h2>
        <div className=' grid pb-4 pt-4'>
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, นามสกุล, หรืออีเมล"
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
                <th style={{ textAlign: 'center' }}>ชื่อ</th>
                <th style={{ textAlign: 'center' }}>นามสกุล</th>
                <th style={{ textAlign: 'center' }}>email</th>
                <th style={{ textAlign: 'center' }}>การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {renderOwnerTableRows(currentItems)}
            </tbody>
          </table>
          <div className="pagination flex justify-center mt-4">
            <Pagination
              totalItems={filteredOwnerList.length} // จำนวนรายการทั้งหมดที่ต้องการแสดงใน pagination
              itemsPerPage={itemsPerPage} // จำนวนรายการต่อหน้า
              onPageChange={handlePageChange} // ฟังก์ชันที่จะเรียกเมื่อเปลี่ยนหน้า
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerUserManagementPage