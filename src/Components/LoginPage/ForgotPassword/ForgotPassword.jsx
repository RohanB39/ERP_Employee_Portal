import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fireDB } from '../../Firebase/FirebaseConfig';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import styles from './ForgotPassword.module.css';
import Logo from '../../../assets/Logo.png';
import LoginBg1 from '../../../assets/LoginBG1.jpg';
import LoginBg2 from '../../../assets/LoginBG2.jpg';
import LoginBg3 from '../../../assets/LoginBG3.jpg';

const images = [LoginBg1, LoginBg2, LoginBg3];

const ForgotPassword = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [slide, setSlide] = useState(true);
    const [employeeId, setEmployeeId] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [userEnteredOtp, setUserEnteredOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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

    const sendOtp = async () => {
        try {
            const q = query(
                collection(fireDB, 'employees'),
                where('employeeId', '==', employeeId)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                let employeeFound = false;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.Status === 'Onboarded') {
                        employeeFound = true;
                        const generatedOtpValue = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(generatedOtpValue);
                        axios.post('https://otp-email-api.vercel.app/sendMail', {
                            email: data.personalInfo.personalEmail,
                            otp: generatedOtpValue,
                        })
                            .then(() => {
                                setIsOtpSent(true);
                            })
                            .catch((error) => {
                                console.error('Error sending OTP:', error);
                                alert('Failed to send OTP. Please try again.');
                            });
                    }
                });

                if (!employeeFound) {
                    setError('Employee status is not Onboarded');
                }
            } else {
                setError('No employee found with this ID');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
            setError('An error occurred while fetching employee data. Please try again.');
        }
    };

    const handleAlreadyAccount = () => {
        navigate('/');
    };

    const verifyOtp = () => {
        if (userEnteredOtp === generatedOtp) {
            setIsOtpVerified(true);
        } else {
            setError('Incorrect OTP. Please try again.');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword === confirmPassword) {
            try {
                const employeesRef = collection(fireDB, 'employees');
                const q = query(employeesRef, where('employeeId', '==', employeeId));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    querySnapshot.forEach(async (docSnapshot) => {
                        const employeeDocRef = doc(fireDB, 'employees', docSnapshot.id);
                        await updateDoc(employeeDocRef, {
                            password: confirmPassword
                        });

                        setSuccess('Password changed successfully!');
                        setTimeout(() => {
                            navigate('/');
                        }, 5000);
                    });
                } else {
                    setError('Employee ID not found.');
                }
            } catch (error) {
                setError('Error updating password. Please try again.');
                console.error('Error updating password:', error);
            }
        } else {
            setError('Passwords do not match.');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <img src={Logo} alt="Logo" className={styles.logo} />
            <div className={styles.formContainer}>
                <form className={styles.loginForm} onSubmit={(e) => { e.preventDefault(); sendOtp(); }}>
                    <div className={styles.logo1}>
                        <span>tecti</span>
                        <span className={styles.logo3}>HR</span>
                    </div>
                    <h2>Forgot Your Password 🥲</h2>

                    {!isOtpSent && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter Employee ID"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                required
                            />
                            <button type="submit" className={styles.signInButton}>
                                Send OTP
                            </button>
                        </>
                    )}

                    {isOtpSent && !isOtpVerified && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={userEnteredOtp}
                                onChange={(e) => setUserEnteredOtp(e.target.value)}
                                required
                            />
                            <button type="button" onClick={verifyOtp} className={styles.signInButton}>Verify OTP</button>
                        </>
                    )}

                    {isOtpVerified && (
                        <>
                            <input
                                type="password"
                                placeholder="Set Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={handleChangePassword} className={styles.signInButton}>Change</button>
                        </>
                    )}

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{error}</p>}

                    <button type="button" className={styles.forgotPasswordButton} onClick={handleAlreadyAccount}>
                        Already Have An Account?
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

export default ForgotPassword;
