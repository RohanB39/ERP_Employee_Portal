import React from 'react'
import styles from './EmployeeDash.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/Header';
import GoodThoughts from './goodThoughts/GoodThoughts';
import Cards from './Cards/Cards';
const EmployeeDash = () => {
  return (
    <div className={styles.EmployeeDash}>
      <Header />
      <div className={styles.EmployeeDashMainContent}>
        <div className={styles.goodThoughts}>
            <GoodThoughts />
        </div>
        <div className={styles.cards}>
            <Cards />
        </div>
      </div>
    </div>
  )
}

export default EmployeeDash