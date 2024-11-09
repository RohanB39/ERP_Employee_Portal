import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leave from './Leave.module.css';
import Header from '../Header/Header';
import { FaDownload } from 'react-icons/fa';
import { useEmployee } from '../../EmployeeContext';
import { fireDB } from '../Firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


const Leave = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const { employeeId, setEmployeeId } = useEmployee();
  const [leaveData, setLeaveData] = useState(null);
  const [error, setError] = useState(null);
  const [daysUntilExpiry, setDaysUntilExpiry] = useState(null);

  const handleApplyClick = () => {
    navigate('/apply');
  };

  const handleDownloadClick = () => {
    if (!leaveData || !employeeId) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Leave Details Report`, 10, 20);

    // Employee ID and Year
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Employee ID: ${employeeId}`, 10, 30);
    doc.text(`Year: ${currentYear}`, 10, 40);

    // Leave Summary Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Leave Summary`, 10, 50);

    // Leave Data Table
    doc.autoTable({
      startY: 60,
      head: [['Leave Type', 'Granted', 'Balance', 'Expires In (Days)']],
      body: [
        ['Casual Leave', leaveData.casualLeave, leaveData.casualLeave, daysUntilExpiry],
        ['Earned Leave', leaveData.earnLeave, leaveData.earnLeave, daysUntilExpiry],
        ['HPL Leave', leaveData.hplLeave, leaveData.hplLeave, daysUntilExpiry],
      ],
      styles: { halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [63, 81, 181], textColor: [255, 255, 255] },
      theme: 'grid',
    });

    // Leave Policies Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Leave Policies Overview`, 10, doc.autoTable.previous.finalY + 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Casual Leave: Casual leave is allocated annually or monthly and may be used for short-term personal needs.`, 10, doc.autoTable.previous.finalY + 30);
    doc.text(`Earned Leave: Earned leave accrues over time and can be utilized for longer breaks or vacations.`, 10, doc.autoTable.previous.finalY + 40);
    doc.text(`HPL Leave: Half-Pay Leave (HPL) is provided for extended personal or medical requirements.`, 10, doc.autoTable.previous.finalY + 50);

    // Footer with Date of Report Generation
    const generationDate = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${generationDate}`, 10, 280);

    // Save the PDF
    doc.save(`LeaveDetails_${employeeId}.pdf`);
  };


  useEffect(() => {
    const fetchLeaveData = async () => {
      if (!employeeId) return;

      try {
        const employeeDocRef = doc(fireDB, 'employees', employeeId);
        const docSnap = await getDoc(employeeDocRef);

        if (docSnap.exists()) {
          const employeeData = docSnap.data();
          const { leaveInfo } = employeeData;
          const { LeaveStatus, EndDate, casualLeave, earnLeave, hplLeave } = leaveInfo;

          const currentDate = new Date();

          // Assuming EndDate is in "DD-MM-YYYY" format
          const [day, month, year] = EndDate.split('-');
          const endDate = new Date(`${year}-${month}-${day}`); // Parse to "YYYY-MM-DD"

          if (LeaveStatus === 'Not Used') {
            if (endDate < currentDate) {
              setError('Your leaves are expired.');
            } else {
              setLeaveData({ casualLeave, earnLeave, hplLeave });
              setError(null); // Clear any previous error
              const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
              setDaysUntilExpiry(daysLeft);
            }
          }
        } else {
          setError('Employee data not found.');
        }
      } catch (error) {
        setError('Leaves are not assigned by HR Team');
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaveData();
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId && location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
    }
  }, [location.state, employeeId, setEmployeeId]);

  return (
    <div>
      <Header />
      <div className={leave.leaveNavbar}>
        <button onClick={handleApplyClick} className={leave.applyButton}>Apply</button>
        <button onClick={handleDownloadClick} className={leave.downloadButton}>
          <FaDownload />
        </button>
        <span className={leave.year}>{currentYear}</span>
      </div>

      {error && <div className={leave.error}>{error}</div>}

      <div className={leave.leaveBoxes}>
        <div className={leave.box}>
          <div className={leave.boxHeader}>
            <span>Casual Leave</span>
            <span className={leave.granted}>Granted: {leaveData ? leaveData.casualLeave : '0'}</span>
          </div>
          <div className={leave.balance}>
            <span>{leaveData ? leaveData.casualLeave : '0'}</span>
            <span>Balance</span>
            <span>Leaves Expire In {daysUntilExpiry} Days</span>
          </div>
        </div>

        <div className={leave.box}>
          <div className={leave.boxHeader}>
            <span>Earned Leave</span>
            <span className={leave.granted}>Granted: {leaveData ? leaveData.earnLeave : '0'}</span>
          </div>
          <div className={leave.balance}>
            <span>{leaveData ? leaveData.earnLeave : '0'}</span>
            <span>Balance</span>
            <span>Leaves Expire In {daysUntilExpiry} Days</span>
          </div>
        </div>

        <div className={leave.box}>
          <div className={leave.boxHeader}>
            <span>HPL Leave</span>
            <span className={leave.granted}>Granted: {leaveData ? leaveData.hplLeave : '0'}</span>
          </div>
          <div className={leave.balance}>
            <span>{leaveData ? leaveData.hplLeave : '0'}</span>
            <span>Balance</span>
            <span>Leaves Expire In {daysUntilExpiry} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
