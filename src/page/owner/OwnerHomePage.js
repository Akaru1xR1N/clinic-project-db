import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';

function OwnerHomePage() {

  const [InusedClinic, setInusedClinic] = useState([]);
  const [UnusedClinic, setUnusedClinic] = useState([]);

  const [deleted, setDeleted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [closed, setClosed] = useState(false);

  //VisibleTable
  const [isTableInusedVisible, setIsTableInusedVisible] = useState(false);
  const [isTableUnusedVisible, setIsTableUnusedVisible] = useState(false);

  const toggleTableInusedVisibility = () => {
    setIsTableInusedVisible(!isTableInusedVisible);
  };

  const toggleTableUnusedVisibility = () => {
    setIsTableUnusedVisible(!isTableUnusedVisible);
  };

  //Navigation
  const ToAddClinic = () => {
    window.location.href = '/owner/add/clinic';
  };

  const ToEditClinic = (clinicID) => {
    window.location.href = '/owner/edit/clinic/' + clinicID;
  }

  //loadData
  useEffect(() => {
    const fetchDataInuesdTable = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/inused');
        if (!data.error) {
          setInusedClinic(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDataUnuesdTable = async () => {
      try {
        const { data } = await axios.get(process.env.REACT_APP_API_URL + 'clinic/unused');
        if (!data.error) {
          setUnusedClinic(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataInuesdTable();
    fetchDataUnuesdTable();
  }, [opened, deleted, closed]);

  //DeleteData
  const ChangeToClose = async (clinicID) => {
    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการปิดให้บริการใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        setClosed(false);
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic', { data: { clinicID: clinicID } });
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

  const deleteClinic = async (clinicID) => {
    await Swal.fire({
      icon: 'warning',
      title: 'ต้องการลบคลินิกใช่หรือไม่?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    })
      .then(async (result) => {
        setDeleted(false);
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(process.env.REACT_APP_API_URL + 'clinic', { data: { clinicID: clinicID } });
            if (response.status === 200) {
              await Swal.fire({
                icon: 'success',
                title: 'ปิดให้บริการ',
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

  //ToOpenClinic
  const ChangeToOpen = async (clinicID) => {
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
        const response = await axios.post(process.env.REACT_APP_API_URL + 'clinic/bringback', { clinicID: clinicID });
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
      setOpened(false)
    }
  };

  //Datafortable
  const renderInusedTableRows = (InusedClinic) => {
    return InusedClinic.map(clinic => {
      return (
        <tr key={clinic.clinicID}>
          <td style={{ textAlign: 'center' }}>{clinic.province}</td>
          <td style={{ textAlign: 'center' }}>{clinic.name}</td>
          <td style={{ textAlign: 'center' }}>{clinic.totalMoney}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button onClick={() => ToEditClinic(clinic.clinicID)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
              <button onClick={() => ChangeToClose(clinic.clinicID)}>
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

  const renderUnusedTableRows = (UnusedClinic) => {
    return UnusedClinic.map(clinic => {
      return (
        <tr key={clinic.clinicID}>
          <td style={{ textAlign: 'center' }}>{clinic.province}</td>
          <td style={{ textAlign: 'center' }}>{clinic.name}</td>
          <td style={{ textAlign: 'center' }}>{clinic.totalMoney}</td>
          <td style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className=' flex space-x-4'>
              <button onClick={() => ToEditClinic(clinic.clinicID)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>
              <button onClick={() => ChangeToOpen(clinic.clinicID)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" />
                </svg>
              </button>
              <button onClick={() => deleteClinic(clinic.clinicID)}>
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

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>ภาพรวม</h1>
      <div className=''>
        <div className=' flex flex-row-reverse mr-14 space-x-4'>
          <div className=''>
            <button onClick={ToAddClinic} className=' rounded-lg p-3' style={{
              backgroundColor: '#ACFF79',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
            }}>เพิ่มสาขา</button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h2 className=' text-2xl font-normal mb-4'>สาขาของเรา</h2>
          <div>
            <div className=' flex space-x-4 mb-4'>
              <h2 className=' text-xl font-normal'>เปิดให้บริการ</h2>
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
                <table className=' table-auto'>
                  <thead style={{
                    backgroundColor: '#FFB2B2',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <tr>
                      <th style={{ textAlign: 'center' }}>จังหวัด</th>
                      <th style={{ textAlign: 'center' }}>ชื่อสาขา</th>
                      <th style={{ textAlign: 'center' }}>เงินทุน</th>
                      <th style={{ textAlign: 'center' }}>การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderInusedTableRows(InusedClinic)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <div className=' flex space-x-4 mb-4'>
              <h2 className=' text-xl font-normal'>ปิดให้บริการ</h2>
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
              <div className=' grid'>
                <table className=' table-auto'>
                  <thead style={{
                    backgroundColor: '#FFB2B2',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                  }}>
                    <tr>
                      <th style={{ textAlign: 'center' }}>จังหวัด</th>
                      <th style={{ textAlign: 'center' }}>ชื่อสาขา</th>
                      <th style={{ textAlign: 'center' }}>เงินทุน</th>
                      <th style={{ textAlign: 'center' }}>การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderUnusedTableRows(UnusedClinic)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerHomePage