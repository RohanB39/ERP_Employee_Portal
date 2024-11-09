import React, { useState, useEffect } from 'react';
import { FiBell, FiPower, FiChevronDown } from 'react-icons/fi';
import styles from './Header.module.css';
import { useEmployee } from '../../EmployeeContext';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../Firebase/FirebaseConfig'; // Make sure this imports your Firebase configuration

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(0); // Start with 0 notifications
  const [showNotification, setShowNotification] = useState(false);
  const { employeeId, setEmployeeId } = useEmployee();

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const handleBellClick = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Fetch employee data based on employeeId and check leave status
  useEffect(() => {
    const fetchEmployeeLeaveStatus = async () => {
      if (employeeId) {
        try {
          const employeeDocRef = doc(fireDB, 'employees', employeeId); // Get reference to the employee document
          const employeeDoc = await getDoc(employeeDocRef);

          if (employeeDoc.exists()) {
            const employeeData = employeeDoc.data();
            const leaveInfo = employeeData.leaveInfo;

            if (leaveInfo && leaveInfo.LeaveStatus === 'Not Used') {
              setNotificationCount(1); // If leave status is "Not Used", show 1 notification
            } else {
              setNotificationCount(0); // If leave status is not "Not Used", reset notification count
            }
          } else {
            console.log('Employee not found');
          }
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      }
    };

    fetchEmployeeLeaveStatus();
  }, [employeeId, fireDB]); // Run the effect whenever the employeeId changes

  useEffect(() => {
    if (!employeeId && location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
    }
  }, [location.state, employeeId, setEmployeeId]);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.dot}></div>
        <span className={styles.home}>Tecti HR Portal</span>
      </div>
      <div className={styles.right}>
        <span className={styles.quickLinks}>
          Quick Links <FiChevronDown className={styles.dropdownIcon} />
        </span>

        <div className={styles.notificationContainer}>
          <FiBell className={styles.icon} onClick={handleBellClick} />
          {notificationCount > 0 && (
            <div className={styles.notificationBadge}>{notificationCount}</div>
          )}
        </div>

        <FiPower className={styles.icon} onClick={handleLogout} />
      </div>

      {showNotification && (
        <div className={styles.notificationPopup}>
          <p>Your leaves are updated</p>
        </div>
      )}
    </header>
  );
};

export default Header;
