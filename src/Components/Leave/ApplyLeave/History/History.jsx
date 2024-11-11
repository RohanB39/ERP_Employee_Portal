import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../../Firebase/FirebaseConfig';
import styles from './History.module.css';

const History = ({ employeeId }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        // Reference to the employee document
        const employeeRef = doc(fireDB, 'employees', employeeId);
        const employeeDoc = await getDoc(employeeRef);

        if (employeeDoc.exists()) {
          const employeeData = employeeDoc.data();
          const leaveApplications = employeeData?.LeaveApplications || {};
          const filteredLeaves = [];

          // Filter out leaves with status "Approved" or "Rejected"
          for (const leaveId in leaveApplications) {
            const leave = leaveApplications[leaveId];
            if (leave.status === 'Approved' || leave.status === 'Rejected') {
              filteredLeaves.push({
                id: leaveId,
                appliedDate: leave.appliedDate,
                fromDate: leave.fromDate,
                toDate: leave.toDate,
                leaveType: leave.leaveType,
                status: leave.status,
              });
            }
          }

          setLeaveHistory(filteredLeaves);
        }
      } catch (error) {
        console.error('Error fetching leave history:', error);
      }
    };

    fetchLeaveHistory();
  }, [employeeId]);

  return (
    <div>
      <div className={styles.applyBox}>
        <div className={styles.LeaveBox}>
          <span className={styles.line}></span>
          <span className={styles.lve}>History</span>
        </div>
        <div className={styles.mainBox}>
          {leaveHistory.length === 0 ? (
            <p>No leave applications found.</p>
          ) : (
            leaveHistory.map((leave) => (
              <div key={leave.id} className={styles.leaveCard}>
                <h3>{leave.leaveType}</h3>
                <p><strong>Applied On:</strong> {leave.appliedDate}</p>
                <p><strong>From:</strong> {leave.fromDate}</p>
                <p><strong>To:</strong> {leave.toDate}</p>
                <p><strong>Status:</strong> {leave.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
