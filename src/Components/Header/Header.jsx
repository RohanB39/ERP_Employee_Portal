import React from 'react';
import { FiBell, FiPower, FiChevronDown } from 'react-icons/fi'; // Icons for the header
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.dot}></div>
                <span className={styles.home}>Tecti HR Portal</span>
            </div>
            <div className={styles.right}>
                <span className={styles.quickLinks}>
                    Quick Links <FiChevronDown className={styles.dropdownIcon} />
                </span>
                <FiBell className={styles.icon} />
                <FiPower className={styles.icon} />
            </div>
        </header>
    );
};

export default Header;
