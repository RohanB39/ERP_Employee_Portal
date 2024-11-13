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
          console.log("Document ID:", doc.id);
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

  const fetchLeaveData = async () => {
    if (employeeId) {
      try {
        console.log("Fetching leave data for Employee ID:", employeeId);

        const employeeDocQuery = query(collection(fireDB, 'employees'), where("employeeId", "==", employeeId));
        const employeeSnapshot = await getDocs(employeeDocQuery);

        employeeSnapshot.forEach(employeeDoc => {
          const employeeData = employeeDoc.data();
          const leaveApplications = employeeData.LeaveApplications;

          // Check if LeaveApplications exists and is an object
          if (leaveApplications && typeof leaveApplications === 'object') {
            console.log("Leave Applications found:", leaveApplications);

            // Convert the object into an array of leave objects
            const leaveArray = Object.values(leaveApplications);

            leaveArray.forEach(leave => {
              const fromDate = dayjs(leave.fromDate, 'YYYY-MM-DD');
              const toDate = dayjs(leave.toDate, 'YYYY-MM-DD');

              for (let date = fromDate; date.isBefore(toDate) || date.isSame(toDate, 'day'); date = date.add(1, 'day')) {
                const formattedDate = date.format('YYYY-MM-DD');
                console.log(`Setting "On Leave" for date: ${formattedDate}`);

                setAttendanceData(prevData => ({
                  ...prevData,
                  [formattedDate]: 'On Leave'
                }));
              }
            });
          } else {
            console.log("LeaveApplications is not a valid object or is missing:", leaveApplications);
          }
        });
      } catch (error) {
        console.error("Error fetching leave data: ", error);
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
    if (employeeId) {
      fetchAttendanceData();
      fetchLeaveData();
    }
  }, [employeeId, currentMonth]);

  useEffect(() => {
    if (!employeeId && location.state?.employeeId) {
      setEmployeeId(location.state.employeeId);
    }
  }, [location.state, employeeId, setEmployeeId]);



  return (
    <div className={styles.container}>
      <Header />
      {/* Calendar Section */}
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <button onClick={prevMonth}>&lt; Prev</button>
          <div>{currentMonth.format(' D MMMM YYYY')}</div>
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
                className={`${styles.calendarDay} ${status === 'Present' ? styles.presentDay :
                  status === 'On Leave' ? styles.onLeaveDay :
                  status === 'Absent' ? styles.absentDay :
                    ''}`}
                onClick={() => handleAttendance(day)}
              >
                <div className={styles.dayLabel}>{day}</div>
                <button
                  className={`${styles.statusButton} ${status === 'Absent' ? 'absent' :
                    status === 'Present' ? 'present' :
                      'on-leave'}`}
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
