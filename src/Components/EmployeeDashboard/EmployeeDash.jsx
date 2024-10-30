import React from 'react'
import styles from './EmployeeDash.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
const EmployeeDash = () => {
  return (
    <div className={styles.EmployeeDash}>
      <div className={styles.secondNav}>
        <h1>Good Evening</h1>
        <p>The quickest way to double your money is to fold it over and put it <br /> back in your pocket.</p>
        <p>- Will Rogers</p>
      </div>

      <div className={styles.cards}>

      </div>

    </div>
  )
}

export default EmployeeDash