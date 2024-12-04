import React, { useState } from 'react';
import styles from './Payslip.module.css';
import Header from '../../Header/Header';
import payslipIllustration from '../../../assets/payslip.jpg'; // Example illustration

const Payslip = () => {
  // Dummy payslip data
  const payslipData = {
    January: { basic: 40000, hra: 15000, allowances: 10000, deductions: 5000, netSalary: 60000 },
    February: { basic: 41000, hra: 15200, allowances: 10200, deductions: 5200, netSalary: 61200 },
    March: { basic: 42000, hra: 15400, allowances: 10400, deductions: 5400, netSalary: 62400 },
  };

  const [selectedMonth, setSelectedMonth] = useState('');
  const [payslipDetails, setPayslipDetails] = useState(null);

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    setPayslipDetails(payslipData[month] || null);
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
          {Object.keys(payslipData).map((month) => (
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
            <div className={styles.cardContent}>
              <div className={styles.cardRow}>
                <span>Basic Pay:</span>
                <span>₹{payslipDetails.basic}</span>
              </div>
              <div className={styles.cardRow}>
                <span>HRA:</span>
                <span>₹{payslipDetails.hra}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Allowances:</span>
                <span>₹{payslipDetails.allowances}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Deductions:</span>
                <span>₹{payslipDetails.deductions}</span>
              </div>
              <div className={`${styles.cardRow} ${styles.netSalary}`}>
                <span>Net Salary:</span>
                <span>₹{payslipDetails.netSalary}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslip;
