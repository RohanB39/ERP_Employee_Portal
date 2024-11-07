import React from 'react'
import leave from './Leave.module.css';
import Header from '../Header/Header';
import { FaDownload } from 'react-icons/fa';
const Leave = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <Header />
      <div className={leave.leaveNavbar}>
        <button className={leave.applyButton}>Apply</button>
        <button className={leave.downloadButton}>
          <FaDownload />
        </button>
        <span className={leave.year}>{currentYear}</span>
      </div>
    </div>
  )
}

export default Leave