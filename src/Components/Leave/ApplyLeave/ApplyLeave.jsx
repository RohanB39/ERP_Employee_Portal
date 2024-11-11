import React, { useState, useEffect } from 'react';
import styles from './ApplyLeave.module.css';
import Header from '../../Header/Header';
import Pending from '../ApplyLeave/Pending/Pending';
import History from '../ApplyLeave/History/History';
import { useEmployee } from '../../../EmployeeContext';
import { fireDB } from '../../Firebase/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const ApplyLeave = () => {
  const [activeComponent, setActiveComponent] = useState('apply');
  const [isTopContentVisible, setIsTopContentVisible] = useState(true);
  const { employeeId, setEmployeeId } = useEmployee();
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveBalance, setLeaveBalance] = useState({ casual: 0, earned: 0, hpl: 0 });
  const [daysRequested, setDaysRequested] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!employeeId && location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
    }
  }, [location.state, employeeId, setEmployeeId]);

  useEffect(() => {
    const fetchLeaveInfo = async () => {
      if (employeeId) {
        const docRef = doc(fireDB, 'employees', employeeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const leaveInfo = docSnap.data().leaveInfo;
          if (!leaveInfo) {
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'Leaves are not assigned to you.',
            });
          } else {
            setLeaveBalance({
              casual: leaveInfo.casualLeave,
              earned: leaveInfo.earnLeave,
              hpl: leaveInfo.hplLeave,
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Employee not found.',
          });
        }
      }
    };
    fetchLeaveInfo();
  }, [employeeId]);

  useEffect(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffInMs = end - start;
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
      setDaysRequested(days);
    }
  }, [fromDate, toDate]);

  const handleSubmit = async () => {
    if (!leaveType || !fromDate || !toDate || !reason) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields before submitting.',
      });
      return;
    }
    const docRef = doc(fireDB, 'employees', employeeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const employeeData = docSnap.data();
      if (!employeeData.leaveInfo) {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Leaves are not assigned to you. Please contact HR.',
        });
        return;
      }
      if (leaveType && daysRequested > 0) {
        const updatedLeaveBalance = { ...leaveBalance };
        const leaveApplicationDetails = {
          leaveType,
          daysRequested,
          fromDate,
          toDate,
          reason,
          status: 'Pending',
          appliedDate: new Date().toISOString(),
        };
        await updateDoc(docRef, {
          [`leaveInfo.${leaveType}Leave`]: updatedLeaveBalance[leaveType],
          [`LeaveApplications.${leaveType}_${Date.now()}`]: leaveApplicationDetails,
        });

        Swal.fire({
          icon: 'success',
          title: 'Leave Submitted',
          text: `You have successfully applied for ${daysRequested} day(s) of leave.`,
        });

        setLeaveType('');
        setFromDate('');
        setToDate('');
        setReason('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date Range',
          text: 'The "To Date" must be after the "From Date". Please correct the date range.',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Employee Not Found',
        text: 'The employee record could not be found. Please contact HR.',
      });
    }
  };


  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will clear the form and cancel your leave application.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLeaveType('');
        setFromDate('');
        setToDate('');
        Swal.fire('Cancelled', 'Your leave application has been cancelled.', 'success');
      }
    });
  };

  return (
    <div>
      <Header />
      <div className={styles.leaveHeader}>
        <div className={styles.innerheader}>
          <button
            className={`${styles.leaveBtn} ${activeComponent === 'apply' ? styles.active : ''}`}
            onClick={() => setActiveComponent('apply')}
          >
            Apply
          </button>
          <button
            className={`${styles.pendingbtn} ${activeComponent === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveComponent('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.historybtn} ${activeComponent === 'history' ? styles.active : ''}`}
            onClick={() => setActiveComponent('history')}
          >
            History
          </button>
        </div>
      </div>
      <div>
        {activeComponent === 'apply' && (
          <div className={styles.applyBox}>
            <div className={styles.LeaveBox}>
              <span className={styles.line}></span>
              <span className={styles.lve}>Leave</span>
            </div>
            <div className={styles.mainBox}>
              {isTopContentVisible && (
                <div className={styles.topContent}>
                  <p>Leave is earned by an employee and granted by the employer to take time off work. The employee is free to avail this leave in accordance with the company policy.</p>
                </div>
              )}
              <button
                className={styles.hideInfo}
                onClick={() => setIsTopContentVisible(!isTopContentVisible)}
              >
                {isTopContentVisible ? 'Hide' : 'Info'}
              </button>
              <div className={styles.Header}>
                <p>Applying Leave For</p>
              </div>
              <div className={styles.leaveType}>
                <label className={styles.lvetype}>Leave type <span>*</span></label>
                <select
                  className={styles.leaves}
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="">Select Leave type</option>
                  <option value="casual">Casual Leave ({leaveBalance.casual} Leaves remaining)</option>
                  <option value="earned">Earned Leave ({leaveBalance.earned} Leaves remaining)</option>
                  <option value="hpl">HPL Leave ({leaveBalance.hpl} Leaves remaining)</option>
                </select>
              </div>

              <div className={styles.frequency}>
                <div className={styles.from}>
                  <label className={styles.lvetype}>From Date <span>*</span></label>
                  <input
                    className={styles.fromDate}
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className={styles.to}>
                  <label className={styles.lvetype}>To Date <span>*</span></label>
                  <input
                    className={styles.toDate}
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.reason}>
                <label className={styles.reasn}>Reason <span>*</span></label>
                <textarea
                  className={styles.resontext}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className={styles.buttons}>
                <button className={styles.submit} onClick={handleSubmit}>Submit</button>
                <button className={styles.cancel} onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {activeComponent === 'pending' && <Pending employeeId={employeeId} />}
        {activeComponent === 'history' && <History employeeId={employeeId} />}
      </div>
    </div>
  );
};

export default ApplyLeave;
