import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Login from './components/login/Login'
import OwnerLogin from './components/login/OwnerLogin'
import AdminLogin from './components/login/AdminLogin'
import DoctorLogin from './components/login/DoctorLogin'
import Signup from './components/login/Signup'

import { AdminProvider } from './components/contexts/AdminContext'
import { OwnerProvider } from './components/contexts/AdminContext'
import { CustomerProvider } from './components/contexts/AdminContext'
import { DoctorProvider } from './components/contexts/AdminContext'

//general
import HomePage from './page/general/HomePage'
import AboutUsPage from './page/general/AboutUsPage'

//customer
import CustomerHomePage from './page/customer/CustomerHomePage'
import CustomerIn_ProgressPage from './page/customer/CustomerIn_ProgressPage'
import CustomerRegisteredPage from './page/customer/CustomerRegisteredPage'
import CustomerCompletedPage from './page/customer/CustomerCompletedPage'

//admin
import AdminHomePage from './page/admin/AdminHomepage'
import AdminUserManageMent from './page/admin/AdminUserManagementPage'
import AdminUserAddAdmin from './page/admin/AdminUserAddAdmin'
import AdminUserEditAdmin from './page/admin/AdminUserEditAdmin'
import AdminUserAddDoctor from './page/admin/AdminUserAddDoctor'
import AdminUserEditDoctor from './page/admin/AdminUserEditDoctor'
import AdminServicePage from './page/admin/AdminServicePage'
import AdminAddService from './page/admin/AdminAddService'
import AdminEditService from './page/admin/AdminEditService'
import AdminOrderPage from './page/admin/AdminOrderPage'
import AdminStoragesPage from './page/admin/AdminStoragesPage'
import AdminAddOrder from './page/admin/AdminAddOrder'


//doctor
import DoctorHomePage from './page/doctor/DoctorHomePage'
import DoctorTimeTablePage from './page/doctor/DoctorTimeTablePage'
import DoctorStoragesPage from './page/doctor/DoctorStoragesPage'

//owner
import OwnerHomePage from './page/owner/OwnerHomePage'
import OwnerAddClinic from './page/owner/OwnerAddClinic'
import OwnerEditClinic from './page/owner/OwnerEditClinic'
import OwnerUserManagementPage from './page/owner/OwnerUserManagementPage'
import OwnerAddAdmin from './page/owner/OwnerAddAdmin'
import OwnerAddOwner from './page/owner/OwnerAddOwner'
import OwnerEditOwner from './page/owner/OwnerEditOwner'
import OwnerEditAdmin from './page/owner/OwnerEditAdmin'
import OwnerServicePage from './page/owner/OwnerServicePage'
import OwnerAddService from './page/owner/OwnerAddService'
import OwnerEditService from './page/owner/OwnerEditService'
import OwnerOrderPage from './page/owner/OwnerOrderPage'
import OwnerStoragesPage from './page/owner/OwnerStoragesPage'

const routes = [
  //Login
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/owner/login',
    element: <OwnerLogin />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/doctor/login',
    element: <DoctorLogin />
  },

  //general
  {
    path: '/Home',
    element: <HomePage />
  },
  {
    path: '/aboutUs',
    element: <AboutUsPage />
  },

  //customer
  {
    path: '/customer/Home',
    element: <CustomerHomePage />
  },
  {
    path: '/customer/service/request',
    element: <CustomerIn_ProgressPage />
  },
  {
    path: '/customer/service',
    element: <CustomerRegisteredPage />
  },
  {
    path: '/customer/service/history',
    element: <CustomerCompletedPage />
  },

  //admin
  {
    path: '/admin/Home',
    element: <AdminHomePage />
  },
  {
    path: '/admin/user/management',
    element: <AdminUserManageMent />
  },
  {
    path: '/admin/user/add/admin',
    element: <AdminUserAddAdmin />
  },
  {
    path: '/admin/user/edit/admin/:adminID/*',
    element: <AdminUserEditAdmin />
  },
  {
    path: '/admin/user/add/doctor',
    element: <AdminUserAddDoctor />
  },
  {
    path: '/admin/user/edit/doctor/:doctorID/*',
    element: <AdminUserEditDoctor />
  },
  {
    path: '/admin/service',
    element: <AdminServicePage />
  },
  {
    path: '/admin/add/service',
    element: <AdminAddService />
  },
  {
    path: '/admin/edit/service/:typeID/*',
    element: <AdminEditService />
  },
  {
    path: '/admin/order',
    element: <AdminOrderPage />
  },
  {
    path: '/admin/storage',
    element: <AdminStoragesPage />
  },
  {
    path: '/admin/add/order',
    element: <AdminAddOrder />
  },

  //doctor
  {
    path: '/doctor/Home',
    element: <DoctorHomePage />
  },
  {
    path: '/doctor/time/table',
    element: <DoctorTimeTablePage />
  },
  {
    path: '/doctor/storage',
    element: <DoctorStoragesPage />
  },

  //owner
  {
    path: '/owner/Home',
    element: <OwnerHomePage />
  },
  {
    path: '/owner/add/clinic',
    element: <OwnerAddClinic />
  },
  {
    path: '/owner/edit/clinic/:clinicID/*',
    element: <OwnerEditClinic />
  },
  {
    path: '/owner/user/management',
    element: <OwnerUserManagementPage />
  },
  {
    path: '/owner/add/admin',
    element: <OwnerAddAdmin />
  },
  {
    path: '/owner/add/owner',
    element: <OwnerAddOwner />
  },
  {
    path: '/owner/edit/owner/:ownerID/*',
    element: <OwnerEditOwner />
  },
  {
    path: '/owner/edit/admin/:adminID/*',
    element: <OwnerEditAdmin />
  },
  {
    path: '/owner/service',
    element: <OwnerServicePage />
  },
  {
    path: '/owner/add/service',
    element: <OwnerAddService />
  },
  {
    path: '/owner/edit/service/:typeID/*',
    element: <OwnerEditService />
  },
  {
    path: '/owner/order',
    element: <OwnerOrderPage />
  },
  {
    path: '/owner/storage',
    element: <OwnerStoragesPage />
  },
]

function App() {
  return (
    <Router>
      <OwnerProvider>
        <AdminProvider>
          <DoctorProvider>
            <CustomerProvider>
              <AppContent />
            </CustomerProvider>
          </DoctorProvider>
        </AdminProvider>
      </OwnerProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/owner/login' || location.pathname === '/admin/login' || location.pathname === '/doctor/login' || location.pathname === '/signup';

  const contentStyle = {
    marginLeft: isLoginPage ? '0' : '250px', // ถ้าเป็นหน้า Login กำหนด marginLeft เป็น 0 ไม่มี margin
    padding: isLoginPage ? '0' : '20px', // ถ้าเป็นหน้า Login กำหนด padding เป็น 0 ไม่มี padding
  };

  return (
    <div>
      {!isLoginPage && <Sidebar />}
      <div style={contentStyle}>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}


export default App