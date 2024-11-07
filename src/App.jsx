import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage/LoginPage';
import Sidebar from './Components/Sidebar/Sidebar';
import EmployeeDash from './Components/EmployeeDashboard/EmployeeDash';
import ForgotPassword from './Components/LoginPage/ForgotPassword/ForgotPassword';
import Engage from './Components/Engage/Engage';
import WorkLife from './Components/WorkLife/WorkLife';
import Kudos from './Components/WorkLife/Kudos/Kudos';
import Feedback from './Components/WorkLife/Feedback/Feedback';
import TODO from './Components/TODO/TODO';
import Review from './Components/TODO/Review/Review';
import Salary from './Components/Salary/Salary';
import Payslip from './Components/Salary/Payslip/Payslip';
import Leave from './Components/Leave/Leave';
import ApplyLeave from './Components/Leave/ApplyLeave/ApplyLeave';
import Attendance from './Components/Attendance/Attendance';
import Calender from './Components/Attendance/Calender/Calender';
import './App.css';
import { EmployeeProvider } from './EmployeeContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/forgotPass" element={<ForgotPassword />} />
        </Routes>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <div className="app-container">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<EmployeeDash />} />
                <Route path="/engage" element={<Engage />} />
                <Route path="/workLife" element={<WorkLife />} />
                <Route path="/kudos" element={<Kudos />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/todo" element={<TODO />} />
                <Route path="/review" element={<Review />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/payslip" element={<Payslip />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/apply" element={<ApplyLeave />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/attendance-info" element={<Calender />} />
              </Routes>
            </div>
          </div>
        )}
      </BrowserRouter>
    </EmployeeProvider>
  );
}
export default App;
