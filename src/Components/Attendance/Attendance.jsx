import React, { useState, useEffect } from 'react';
import styles from './Attendance.module.css';
import Header from '../Header/Header';
import dayjs from 'dayjs';
import { useEmployee } from '../../EmployeeContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../Firebase/FirebaseConfig'; 

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [attendanceData, setAttendanceData] = useState({});
  const { employeeId, setEmployeeId } = useEmployee();
  const totalDaysInMonth = currentMonth.daysInMonth();
  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const today = dayjs(); 
  const [avgActualWorkHours, setAvgActualWorkHours] = useState(0);
  const currentMonthh = dayjs().format('YYYY-MM');

  const prevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };
  
  const fetchAttendanceData = async () => {
    if (employeeId) {
      try {
        console.log("Fetching attendance data for Employee ID:", employeeId);
        const q = query(collection(fireDB, 'EMP_SIGNIN_SIGNOUT'));
        const querySnapshot = await getDocs(q);
        let employeeFound = false;
        querySnapshot.forEach(doc => {
          console.log("Document ID:", doc.id); // Log document ID
          if (doc.id === employeeId) {
            employeeFound = true;
            const data = doc.data();
            console.log("Fetched Document Data: ", data); // Log the fetched data
    
            // Loop through the document data to check for a matching signInDate
            Object.keys(data).forEach(date => {
              if (data[date]?.signInDate) {
                // Ensure the sign-in date is in the correct format
                const signInDate = dayjs(data[date].signInDate, 'YYYY-MM-DD').startOf('day').format('YYYY-DD-MM');
                console.log("Sign In Date (formatted): ", signInDate); // Log the formatted sign-in date
    
                // Now check if the signInDate matches the current day being displayed in the calendar
                daysInMonth.forEach(day => {
                  const formattedCurrentDate = currentMonth.format('YYYY-MM') + '-' + (day < 10 ? '0' + day : day); // Format to 'YYYY-MM-DD'
                  console.log("Formatted Current Date (to compare): ", formattedCurrentDate); // Log the formatted date for comparison
    
                  if (signInDate === formattedCurrentDate) {
                    setAttendanceData(prevData => {
                      const updatedData = { ...prevData, [formattedCurrentDate]: 'Present' };
                      console.log("Updated Attendance Data: ", updatedData); // Log the updated state
                      return updatedData;
                    });
                  }
                });
              }
            });
          }
        });
    
        // If no data was found for the employee in the EMP_SIGNIN_SIGNOUT collection, log it
        if (!employeeFound) {
          console.log("No attendance data found for Employee ID:", employeeId);
        }
    
      } catch (error) {
        console.error("Error fetching attendance data: ", error);
      }
    }
  };

  const handleAttendance = (day) => {
    const dateKey = currentMonth.format('YYYY-MM') + '-' + (day < 10 ? '0' + day : day); // Format to 'YYYY-MM-DD'
    setAttendanceData(prevData => ({
      ...prevData,
      [dateKey]: prevData[dateKey] === 'Absent' ? 'Present' : 'Absent',
    }));
  };

  useEffect(() => {
    // Fetch attendance data when the employeeId is set
    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId, currentMonth]);

  useEffect(() => {
    if (!employeeId && location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
    }
  }, [location.state, employeeId, setEmployeeId]);

  const fetchActualWorkHours = async () => {
    if (employeeId) {
      try {
        const q = query(collection(fireDB, 'EMP_SIGNIN_SIGNOUT'));
        const querySnapshot = await getDocs(q);
        let totalWorkHours = 0;
        let daysWithSignInOut = 0;
        querySnapshot.forEach(doc => {
          if (doc.id === employeeId) {
            const data = doc.data();
            console.log('Employee Data:', data);
            Object.keys(data).forEach(date => {
              const dateObj = dayjs(date, 'YYYY-MM-DD');
              if (dateObj.format('YYYY-MM') === currentMonthh) {
                const signInTime = data[date]?.signInTime;
                const signOutTime = data[date]?.signOutTime;
                // Log the signInTime and signOutTime to debug
                console.log(`SignInTime: ${signInTime}, SignOutTime: ${signOutTime}`);
                // Ensure both signInTime and signOutTime are present
                if (signInTime && signOutTime) {
                  const signIn = dayjs(signInTime, 'h:mm:ss A', true);
                  const signOut = dayjs(signOutTime, 'h:mm:ss A', true);
                  // Check if both signIn and signOut are valid
                  if (signIn.isValid() && signOut.isValid() && signOut.isAfter(signIn)) {
                    const workHours = signOut.diff(signIn, 'hour', true); // Calculate hours as float
                    totalWorkHours += workHours;
                    daysWithSignInOut += 1;
                  } else {
                    console.log(`Invalid time or signOut is before signIn for ${date}`);
                  }
                } else {
                  console.log(`Missing signInTime or signOutTime for ${date}`);
                }
              }
            });
          }
        });

        // Calculate average actual work hours
        if (daysWithSignInOut > 0) {
          const avgHours = totalWorkHours / daysWithSignInOut;
          setAvgActualWorkHours(avgHours.toFixed(2)); // Round to 2 decimal places
        } else {
          setAvgActualWorkHours(0); // Set to 0 if no valid entries found
        }

      } catch (error) {
        console.error("Error fetching actual work hours: ", error);
      }
    }
  };

  useEffect(() => {
    fetchActualWorkHours();
  }, [employeeId, currentMonthh]);

  return (
    <div className={styles.container}>
      <Header />

      {/* Cards Section */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3>Avg. Work Hrs</h3>
          <p>8:00 Hrs</p>
        </div>
        <div className={styles.card}>
          <h3>Avg. Actual Work Hrs</h3>
          <p>{avgActualWorkHours} Hrs</p>
        </div>
        <div className={styles.card}>
          <h3>Penalty Days</h3>
          <p>2</p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button onClick={prevMonth}>&lt; Prev</button>
          <div>{currentMonth.format('MMMM YYYY')}</div>
          <button onClick={nextMonth}>Next &gt;</button>
        </div>

        <div className={styles.calendarGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className={styles.dayLabel}>
              {day}
            </div>
          ))}

          {daysInMonth.map((day) => {
            const dateKey = currentMonth.format('YYYY-MM') + '-' + (day < 10 ? '0' + day : day);
            const status = attendanceData[dateKey] || 'Absent'; // Default to 'Absent'
            const currentDate = dayjs(`${currentMonth.format('YYYY-MM')}-${day}`, 'YYYY-MM-DD');
            
            // Skip future days
            if (currentDate.isAfter(today, 'day')) {
              return (
                <div key={day} className={styles.calendarDay}>
                  <div className={styles.dayLabel}>{day}</div>
                </div>
              );
            }

            return (
              <div
                key={day}
                className={`${styles.calendarDay} ${status === 'Present' ? styles.presentDay : ''}`}
                onClick={() => handleAttendance(day)}
              >
                <div className={styles.dayLabel}>{day}</div>
                <button
                  className={`${styles.statusButton} ${status === 'Absent' ? 'absent' : 'present'}`}
                >
                  {status}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
