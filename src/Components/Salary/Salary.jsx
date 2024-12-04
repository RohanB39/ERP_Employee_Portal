import React from 'react';
import styles from './Salary.module.css';
import Header from '../Header/Header';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

import { useEmployee } from '../../EmployeeContext';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Salary = () => {
  const { employeeId, setEmployeeId } = useEmployee();

  const pieData = {
    labels: ['Basic Pay', 'HRA', 'Allowances', 'Deductions'],
    datasets: [
      {
        data: [40000, 15000, 10000, 5000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Monthly Salary (₹)',
        data: [70000, 75000, 73000, 72000, 76000],
        backgroundColor: '#4BC0C0',
      },
    ],
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <h1 className={styles.title}>Your Salary Dashboard {employeeId}</h1>
        <div className={styles.chartsContainer}>
          {/* Salary Breakdown Pie Chart */}
          <div className={styles.chartBox}>
            <h2 className={styles.chartTitle}>Salary Breakdown</h2>
            <Pie data={pieData} />
          </div>
          {/* Monthly Trends Bar Chart */}
          <div className={styles.chartBox}>
            <h2 className={styles.chartTitle}>Monthly Trends</h2>
            <Bar data={barData} />
          </div>
        </div>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <h3>Total Earnings</h3>
            <p>₹75,000</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Total Deductions</h3>
            <p>₹5,000</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Net Salary</h3>
            <p>₹70,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;
