import React from 'react'
import styles from './Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.UpperNav}>
                <span className={styles.home}>Home</span>
                <div className={styles.ico}>
                    <FontAwesomeIcon icon={faBell} className={styles.icon} />
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
                </div>
            </div>
        </div>
    )
}

export default Header