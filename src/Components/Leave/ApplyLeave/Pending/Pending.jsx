import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../../Firebase/FirebaseConfig';
import styles from './Pending.module.css';

const Pending = ({ employeeId }) => {
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      const employeeDocRef = doc(fireDB, 'employees', employeeId);
      const employeeDoc = await getDoc(employeeDocRef);
      const data = employeeDoc.data();

      if (data && data.LeaveApplications) {
        const pending = [];
        Object.entries(data.LeaveApplications).forEach(([leaveId, leaveData]) => {
          if (leaveData.status === 'Pending') {
            pending.push({
              leaveId,
              appliedDate: leaveData.appliedDate,
              leaveType: leaveData.leaveType,
            });
          }
        });
        setPendingLeaves(pending);
      }
    };

    if (employeeId) {
      fetchPendingLeaves();
    }
  }, [employeeId]);

  return (
    <div>
      <div className={styles.applyBox}>
        <div className={styles.LeaveBox}>
          <span className={styles.line}></span>
          <span className={styles.lve}>Pending</span>
        </div>
        <div className={styles.mainBox}>
          {pendingLeaves.length === 0 ? (
            <p>No pending leave applications</p>
          ) : (
            pendingLeaves.map((leave) => (
              <div className={styles.leaveCard} key={leave.leaveId}>
                <h4 className={styles.leaveTitle}>Leave ID: {leave.leaveId}</h4>
                <p className={styles.leaveDetail}>Applied Date: {leave.appliedDate}</p>
                <p className={styles.leaveDetail}>Leave Type: {leave.leaveType}</p>
                <p className={styles.leaveStatus}>Status: Waiting for HR Approval</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Pending;
