import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faSatelliteDish, faTasks, faMoneyCheck, faCalendarAlt, faUserClock,
    faChevronDown, faChevronUp, faBars, faUserCircle, faCogs
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/Logo.png'
import { useLocation } from 'react-router-dom';
import { useEmployee } from '../../EmployeeContext';

const Sidebar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    // const employeeId = location.state?.employeeId
    const { employeeId, setEmployeeId } = useEmployee();

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(prevState => (prevState === dropdown ? null : dropdown));
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    useEffect(() => {
        if (!employeeId && location.state?.employeeId) {
          setEmployeeId(location.state.employeeId);
        }
      }, [location.state, employeeId, setEmployeeId]);

    return (
        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.close}`}>
            {/* Hamburger Icon */}
            <button className={styles.hamburger} onClick={handleSidebarToggle}>
                <FontAwesomeIcon icon={faBars} />
            </button>


            {/* Logo Section */}
            <div className={styles.logo}>
                <img src={Logo} alt="Tectigon" />
            </div>

            {/* Profile Section */}
            <div className={styles.profile}>
                <FontAwesomeIcon icon={faUserCircle} className={styles.avatar} />
                <div className={styles.profileInfo}>
                    <p className={styles.username}>Hi {employeeId}</p>
                    <p className={styles.viewInfo}>View My Info</p>
                </div>
                <FontAwesomeIcon icon={faCogs} className={styles.settingsIcon} />
            </div>

            {/* Menu Section */}
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faHome} className={styles.icon} />
                        <span>Home</span>
                    </NavLink>
                </li>

                <li className={styles.navItem}>
                    <NavLink
                        to="/engage"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faSatelliteDish} className={styles.icon} />
                        <span>Engage</span>
                    </NavLink>
                </li>

                {/* My Worklife Dropdown */}
                <li className={styles.navItem} onClick={() => toggleDropdown('worklife')}>
                    <NavLink
                        to="/workLife"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faTasks} className={styles.icon} />
                        <span>Worklife</span>
                    </NavLink>
                    <FontAwesomeIcon
                        icon={openDropdown === 'worklife' ? faChevronUp : faChevronDown}
                        className={styles.chevron}
                    />
                </li>
                {openDropdown === 'worklife' && (
                    <ul className={styles.dropdownList}>
                        <div className={styles.dropdownListItem}>
                            <span className={styles.Line}></span>
                            <div>
                                <NavLink
                                    to="/kudos"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <li className={styles.dropdownItem}>Kudos</li>
                                </NavLink>
                                <NavLink
                                    to="/feedback"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <li className={styles.dropdownItem}>Feedback</li>
                                </NavLink>
                            </div>
                        </div>
                    </ul>
                )}

                {/* To do Dropdown */}
                <li className={styles.navItem} onClick={() => toggleDropdown('todo')}>
                    <NavLink
                        to="/todo"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faTasks} className={styles.icon} />
                        <span>To do</span>
                    </NavLink>
                    <FontAwesomeIcon
                        icon={openDropdown === 'todo' ? faChevronUp : faChevronDown}
                        className={styles.chevron}
                    />
                </li>
                {openDropdown === 'todo' && (
                    <ul className={styles.dropdownList}>
                        <div className={styles.dropdownListItem}>
                            <span className={styles.Line}></span>
                            <div>
                                <NavLink
                                    to="/review"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <span>Review</span>
                                </NavLink>
                            </div>
                        </div>
                    </ul>
                )}

                {/* Salary Dropdown */}
                <li className={styles.navItem} onClick={() => toggleDropdown('salary')}>
                    <NavLink
                        to="/salary"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faMoneyCheck} className={styles.icon} />
                        <span>Salary</span>
                    </NavLink>
                    <FontAwesomeIcon
                        icon={openDropdown === 'salary' ? faChevronUp : faChevronDown}
                        className={styles.chevron}
                    />
                </li>
                {openDropdown === 'salary' && (
                    <ul className={styles.dropdownList}>
                        <div className={styles.dropdownListItem}>
                            <span className={styles.Line}></span>
                            <div>
                                <NavLink
                                    to="/payslip"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <span>Payslip</span>
                                </NavLink>
                            </div>
                        </div>
                    </ul>
                )}

                {/* Leave Dropdown */}
                <li className={styles.navItem} onClick={() => toggleDropdown('leave')}>
                    <NavLink
                        to="/leave"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} className={styles.icon} />
                        <span>Leave</span>
                    </NavLink>
                    <FontAwesomeIcon
                        icon={openDropdown === 'leave' ? faChevronUp : faChevronDown}
                        className={styles.chevron}
                    />
                </li>
                {openDropdown === 'leave' && (
                    <ul className={styles.dropdownList}>
                        <div className={styles.dropdownListItem}>
                            <span className={styles.Line}></span>
                            <div>
                                <NavLink
                                    to="/apply"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <span>Leave Apply</span>
                                </NavLink>
                            </div>
                        </div>
                    </ul>
                )}

                {/* Attendance Dropdown */}
                <li className={styles.navItem} onClick={() => toggleDropdown('attendance')}>
                    <NavLink
                        to="/attendance"
                        className={({ isActive }) =>
                            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                        }
                    >
                        <FontAwesomeIcon icon={faUserClock} className={styles.icon} />
                        <span>Attendance</span>
                    </NavLink>
                    {/* <FontAwesomeIcon
                        icon={openDropdown === 'attendance' ? faChevronUp : faChevronDown}
                        className={styles.chevron}
                    /> */}
                </li>
                {/* {openDropdown === 'attendance' && (
                    <ul className={styles.dropdownList}>
                        <div className={styles.dropdownListItem}>
                            <span className={styles.Line}></span>
                            <div>
                                <NavLink
                                    to="/attendance-info"
                                    className={({ isActive }) =>
                                        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                    }
                                >
                                    <span>Attendance Calander</span>
                                </NavLink>
                            </div>
                        </div>
                    </ul>
                )} */}
            </ul>
        </div>
    );
};

export default Sidebar;
