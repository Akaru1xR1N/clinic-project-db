import React, { useEffect, useState } from 'react'
import { useAdmin } from '../../components/contexts/AdminContext';
import GraphCaseComponent from '../../components/graph/GraphCaseComponents';
import GraphComponent from '../../components/graph/GraphComponent';
import axios from 'axios';
import Select from 'react-select';

function AdminHomepage() {

  const { adminDetail } = useAdmin();

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [totalStatementList, setTotalStatementList] = useState('');

  const [statementList, setStatementList] = useState([]);
  const [caseList, setCaseList] = useState([]);
  const monthList = [
    { value: 1, label: "มกราคม" },
    { value: 2, label: "กุมภาพันธ์" },
    { value: 3, label: "มีนาคม" },
    { value: 4, label: "เมษายน" },
    { value: 5, label: "พฤษภาคม" },
    { value: 6, label: "มิถุนายน" },
    { value: 7, label: "กรกฎาคม" },
    { value: 8, label: "สิงหาคม" },
    { value: 9, label: "กันยายน" },
    { value: 10, label: "ตุลาคม" },
    { value: 11, label: "พฤศจิกายน" },
    { value: 12, label: "ธันวาคม" }
  ];

  useEffect(() => {
    const isAdminLogined = localStorage.getItem('isAdminLogined');

    if (isAdminLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/admin/login';
    }
  }, []);

  const onchangeMonth = async (monthList) => {
    setMonth(monthList.value);
  };

  const ToSearch = async () => {
    const searchData = {
      clinicID: adminDetail.clinicID,
      month: month,
      year: year,
    }

    const searchCaseData = {
      clinicID: adminDetail.clinicID,
      year: year,
    }

    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'summary/statement', { params: searchData })
      setStatementList(data.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'summary/totalstatement', { params: searchData })
      setTotalStatementList(data.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const { data } = await axios.get(process.env.REACT_APP_API_URL + 'summary/totalCase', { params: searchCaseData })
      setCaseList(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className=' text-4xl font-normal text-center p-7'>ภาพรวม</h1>
      <div className=' grid pb-4 pt-4'>
        <span className=' text-2xl font-normal mb-4'>ข้อมูลค่าใช้จ่ายประจำเดือน</span>
        <div className=' flex space-x-7'>
          <Select className=' w-2/5'
            options={monthList}
            onChange={onchangeMonth}
            placeholder='---โปรดระบุชื่อเดือน---'>
          </Select>
          <input className=' border-2 border-black rounded-full w-2/5 py-1 px-6'
            onChange={(event) => {
              setYear(event.target.value);
            }}
            value={year}
            placeholder='ระบุปี (ค.ศ.)'
          />
        </div>
        <div className=' mt-4'>
          <button onClick={ToSearch} className=' rounded-lg p-3' style={{
            backgroundColor: '#FF79E2',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          >
            ค้นหา
          </button>
        </div>
        <span className=' text-2xl font-normal mb-2 mt-4'>รายได้สุทธิ : {totalStatementList} บาท</span>
      </div>
      <div>
        <GraphComponent statementList={statementList} />
      </div>
      <div>
        <GraphCaseComponent caseList={caseList} />
      </div>
    </div>
  )
}

export default AdminHomepage