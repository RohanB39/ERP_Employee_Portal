import React, { useState, useEffect } from 'react';
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
import { fireDB, doc, collection, getDocs } from '../Firebase/FirebaseConfig';
import {getDoc} from 'firebase/firestore';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Salary = () => {
  const { employeeId } = useEmployee();
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch salary details from Firestore when employeeId changes
  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        if (!employeeId) return; // Check if employeeId is available

        const employeeDocRef = doc(fireDB, 'employees', employeeId); // Reference to the employee document
        const employeeDoc = await getDoc(employeeDocRef); // Get the employee document

        if (employeeDoc.exists()) {
          const salaryDetails = employeeDoc.data().SalaryDetails; // Fetch the SalaryDetails object
          setSalaryDetails(salaryDetails); // Set the fetched salary details to the state
        } else {
          console.log('Employee not found!');
        }
      } catch (error) {
        console.error('Error fetching salary details:', error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchSalaryDetails();
  }, [employeeId]);

  const PF = salaryDetails?.employerPF || 0;
  const gratuity = salaryDetails?.gratuity || 0;
  const insurancePremiums = salaryDetails?.insurancePremiums || 0;
  const deduction = PF + gratuity + insurancePremiums;

  // Default pieData if salary details are not yet fetched
  const pieData = {
    labels: ['Basic Pay', 'Bonus', 'Total CTC', 'Total Fixed Pay', 'Deduction'],
    datasets: [
      {
        data: salaryDetails
          ? [
              salaryDetails.basicPay || 0,
              salaryDetails.bonus || 0,
              salaryDetails.totalCTC || 0,
              salaryDetails.totalFixedPay || 0,
              deduction
            ]
          : [0, 0, 0, 0, 0], // Fallback to 0s if salaryDetails is not loaded
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
      },
    ],
  };

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Monthly Salary (₹)',
        data: [],
        backgroundColor: '#4BC0C0',
      },
    ],
  });

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        if (!employeeId) return;

        // Fetch all documents from Salary_Details collection
        const salaryDetailsRef = collection(fireDB, 'Salary_Details');
        const querySnapshot = await getDocs(salaryDetailsRef);

        let months = [];
        let salaryData = [];

        // Loop through each document
        querySnapshot.forEach((doc) => {
          if (doc.id === employeeId) {  // Compare employeeId with document ID
            const salaryObj = doc.data(); // Get the data of the matched document
            Object.keys(salaryObj).forEach((key) => {
              const monthData = salaryObj[key]; // This is like "2024-11", "2024-12"
              if (monthData && monthData.NetPay) {
                months.push(key); // Push month (e.g., "2024-11")
                salaryData.push(monthData.NetPay); // Push the corresponding NetPay value
              }
            });
          }
        });

        // Set the dynamic barData
        setBarData({
          labels: months,
          datasets: [
            {
              label: 'Monthly Salary (₹)',
              data: salaryData,
              backgroundColor: '#4BC0C0',
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching salary details:', error);
      }
    };

    fetchSalaryDetails();
  }, [employeeId]);

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div className={styles.dashboardContent}>
        <h1 className={styles.title}>Your Salary Dashboard</h1>
        <div className={styles.chartsContainer}>
          {/* Salary Breakdown Pie Chart */}
          <div className={styles.chartBox}>
            <h2 className={styles.chartTitle}>Salary Breakdown Pre Annum</h2>
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
            <h3>Total Earnings Annualy</h3>
            <p>₹{salaryDetails ? salaryDetails.totalCTC : '0'}</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Total Deductions Annualy</h3>
            <p>₹{deduction}</p>
          </div>
          <div className={styles.infoCard}>
            <h3>Net Salary Annualy</h3>
            <p>₹{salaryDetails ? salaryDetails.totalFixedPay : '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salary;
