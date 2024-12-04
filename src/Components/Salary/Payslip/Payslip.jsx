import React, { useState, useEffect } from 'react';
import styles from './Payslip.module.css';
import Header from '../../Header/Header';
import payslipIllustration from '../../../assets/payslip.jpg'; // Example illustration
import { useEmployee } from '../../../EmployeeContext';
import { fireDB, doc, collection, getDocs } from '../../Firebase/FirebaseConfig';

const Payslip = () => {
  const { employeeId } = useEmployee(); // Assuming you're getting the employeeId from context
  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipDetails, setPayslipDetails] = useState(null);
  const [salaryData, setSalaryData] = useState({});

  // Convert month code to month name
  const getMonthName = (monthCode) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const monthNumber = parseInt(monthCode, 10); // 11 for November, 10 for October, etc.
    return months[monthNumber - 1]; // Subtract 1 because array is 0-indexed
  };

  // Fetch salary data from Firestore based on employeeId
  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        if (!employeeId) return;

        // Fetch all documents from Salary_Details collection
        const salaryDetailsRef = collection(fireDB, 'Salary_Details');
        const querySnapshot = await getDocs(salaryDetailsRef);

        querySnapshot.forEach((doc) => {
          if (doc.id === employeeId) {  // Compare employeeId with document ID
            const salaryObj = doc.data(); // Get the data of the matched document
            let monthsData = {};

            Object.keys(salaryObj).forEach((key) => {
              const monthData = salaryObj[key]; // This is like "2024-11", "2024-12"
              const monthName = getMonthName(key.split('-')[1]); // Convert "11" to "November"
              monthsData[monthName] = monthData; // Store in the monthsData object
            });

            setSalaryData(monthsData); // Store the salary data for all months
          }
        });
      } catch (error) {
        console.error('Error fetching salary details:', error);
      }
    };

    fetchSalaryDetails();
  }, [employeeId]);

  // Handle month selection
  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    setPayslipDetails(salaryData[month] || null); // Update payslipDetails for the selected month
  };

  return (
    <div className={styles.payslipContainer}>
      <Header />
      <div className={styles.content}>
        <h1 className={styles.title}>Your Payslip</h1>

        {/* Dropdown */}
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className={styles.dropdown}
        >
          <option value="">Select Month</option>
          {Object.keys(salaryData).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {/* Illustration */}
        {!selectedMonth && (
          <img
            src={payslipIllustration}
            alt="Payslip Illustration"
            className={styles.illustration}
          />
        )}

        {/* Payslip Card */}
        {selectedMonth && payslipDetails && (
          <div className={styles.payslipCard}>
            <h2 className={styles.cardTitle}>Payslip for {selectedMonth}</h2>

            {/* Employee Info Section */}
            <div className={styles.employeeInfo}>
              <div className={styles.employeeRow}>
                <span className={styles.employeeLabel}>Employee Name:</span>
                <span className={styles.employeeValue}>{payslipDetails.EmployeeName}</span>
              </div>
              <div className={styles.employeeRow}>
                <span className={styles.employeeLabel}>Employee Id:</span>
                <span className={styles.employeeValue}>{payslipDetails.EmployeeId}</span>
              </div>
              <div className={styles.employeeRow}>
                <span className={styles.employeeLabel}>Month:</span>
                <span className={styles.employeeValue}>{selectedMonth}</span>
              </div>
            </div>

            {/* Payslip Details Table */}
            <div className={styles.cardContent}>
              <div className={styles.cardRow}>
                <span>Gross Pay:</span>
                <span>₹{payslipDetails.GrossPay}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Approved Leaves:</span>
                <span>{payslipDetails.AprovedLeaves} Days</span>
              </div>
              <div className={styles.cardRow}>
                <span>Taken Leaves:</span>
                <span>{payslipDetails.Takenleaves} Days</span>
              </div>
              <div className={styles.cardRow}>
                <span>Unpaid Leaves:</span>
                <span>{payslipDetails.ExtraLeaves} Days</span>
              </div>
              <div className={styles.cardRow}>
                <span>Working Days:</span>
                <span>{payslipDetails.WorkingDays} Days</span>
              </div>
              <div className={styles.cardRow}>
                <span>Payable Days Including leaves:</span>
                <span>{payslipDetails.PayableDays} Days</span>
              </div>
              <div className={styles.cardRow}>
                <span>Deduction:</span>
                <span className={styles.deduction}>₹{payslipDetails.Deduction}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Payment Status:</span>
                <span className={styles.netP}>{payslipDetails.Status}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Payment Method:</span>
                <span>{payslipDetails.paymentMethod}</span>
              </div>
            </div>
            <div className={styles.netpayi}>
                <div className={styles.cardRown}>
                  <span>Net Pay:</span>
                  <span className={styles.netP}>₹{payslipDetails.NetPay}</span>
                </div>
              </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Payslip;
