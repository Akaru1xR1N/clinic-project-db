import React, { useEffect } from 'react'

function AdminHomepage() {

  useEffect(() => {
    const isAdminLogined = localStorage.getItem('isAdminLogined');

    if (isAdminLogined !== 'true') {
      // ถ้าไม่ได้ล็อกอินให้ redirect ไปยังหน้า login
      window.location.href = '/admin/login';
    }
  }, []);

  return (
    <div>AdminHomepage</div>
  )
}

export default AdminHomepage