import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../Firebase/FirebaseConfig'; // Firebase configuration file
import styles from './LoginPage.module.css';
import Logo from '../../assets/Logo.png';
import LoginBg1 from '../../assets/LoginBG1.jpg';
import LoginBg2 from '../../assets/LoginBG2.jpg';
import LoginBg3 from '../../assets/LoginBG3.jpg';

const images = [LoginBg1, LoginBg2, LoginBg3];

const LoginPage = ({ onLogin }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slide, setSlide] = useState(true);
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Set the current image for background slide
    useEffect(() => {
        const interval = setInterval(() => {
            setSlide(false);
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
                setSlide(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Check localStorage for saved credentials on component mount
    useEffect(() => {
        const savedEmployeeId = localStorage.getItem('employeeId');
        const savedPassword = localStorage.getItem('password');
        if (savedEmployeeId && savedPassword) {
            setEmployeeId(savedEmployeeId);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        console.log('Login attempt initiated');
        try {
            // Query Firestore for the employee with the entered employeeId
            const employeeQuery = query(
                collection(fireDB, 'employees'),
                where('employeeId', '==', employeeId)
            );
            const querySnapshot = await getDocs(employeeQuery);
            if (querySnapshot.empty) {
                setError('Employee ID not found');
                return;
            }
            // Check the employee's status and password
            const employeeData = querySnapshot.docs[0].data();
            if (employeeData.Status !== 'Onboarded') {
                setError('Employee is not onboarded yet');
                return;
            }
            if (employeeData.password !== password) {
                setError('Incorrect password');
                return;
            }
            // store credentials in localStorage
            if (rememberMe) {
                localStorage.setItem('employeeId', employeeId);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('employeeId');
                localStorage.removeItem('password');
            }
            console.log('Navigating to employee-dash with ID:', employeeId);
            onLogin();
            navigate('/', { state: { employeeId: employeeId } });
        } catch (error) {
            setError('Login failed. Please try again.');
            console.error('Error logging in:', error);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgotPass');
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    return (
        <div className={styles.loginContainer}>
            <img src={Logo} alt="Logo" className={styles.logo} />
            <div className={styles.formContainer}>
                <form className={styles.loginForm} onSubmit={handleLogin}>
                    <div className={styles.logo1}>
                        <span>tecti</span>
                        <span className={styles.logo3}>HR</span>
                    </div>
                    <h2>Hello There 👋</h2>
                    <input
                        type="text"
                        name="employeeId"
                        placeholder="Login ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                        autoComplete="username" // Helps browsers recognize it as a username field
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password" // Helps browsers recognize it as a password field
                    />
                    <div className={styles.rememberMeContainer}>
                        <input
                            type="checkbox"
                            className={styles.rememberMeContainerInp}
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                        <label htmlFor="rememberMe" className={styles.rememberMeContainerLeb}>Remember Me</label>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button
                        type="button"
                        className={styles.forgotPasswordButton}
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </button>
                    <button type="submit" className={styles.signInButton}>
                        Log In
                    </button>
                </form>
            </div>

            <div className={styles.second}>
                <img
                    src={images[currentImageIndex]}
                    alt="Background"
                    className={`${styles.secondImg} ${slide ? styles.slideIn : styles.slideOut}`}
                />
            </div>
        </div>
    );
};

export default LoginPage;
