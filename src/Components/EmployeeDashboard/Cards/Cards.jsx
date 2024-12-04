import React, { useState, useEffect } from 'react'
import card from './Cards.module.css';
import illu from '../../../assets/gt_illustration_6.svg';
import track from '../../../assets/track.svg';
import payslip from '../../../assets/payslip.svg';
import ItDec from '../../../assets/itDec.svg';
import { useEmployee } from '../../../EmployeeContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { fireDB } from '../../Firebase/FirebaseConfig';
import Swipes from './Swpies/Swipes';
import Swal from 'sweetalert2';

const Cards = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const { employeeId, setEmployeeId } = useEmployee();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [designation, setDesignation] = useState('');
    const [fullName, setFullName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [buttonText, setButtonText] = useState('Sign In'); 

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-GB').replace(/\//g, '-'); // "29-11-2024"
            setCurrentDate(formattedDate);
            setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long' }));
            setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const employeeDocRef = doc(fireDB, 'employees', employeeId);
                const employeeDoc = await getDoc(employeeDocRef);
                if (employeeDoc.exists()) {
                    const { personalInfo, designation } = employeeDoc.data();
                    setFirstName(personalInfo?.firstName || '');
                    setLastName(personalInfo?.lastName || '');
                    setDesignation(designation || '');
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };
        if (employeeId) fetchEmployeeData();
    }, [employeeId]);

    useEffect(() => {
        setFullName(`${firstName} ${lastName}`.trim());
    }, [firstName, lastName]);

    useEffect(() => {
        const checkSignInStatus = async () => {
            if (fullName) {
                const dateDocId = new Date().toISOString().split('T')[0];
                const employeeDocRef = doc(fireDB, 'EMP_SIGNIN_SIGNOUT', `${fullName} ${dateDocId}`);
                try {
                    const docSnap = await getDoc(employeeDocRef);
                    if (docSnap.exists() && docSnap.data().isSignedIn) {
                        setIsSignedIn(true);
                    }
                } catch (error) {
                    console.error('Error checking sign-in status:', error);
                }
            }
        };
        checkSignInStatus();
    }, [fullName]);

    useEffect(() => {
        const checkAutomaticSignOut = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            if (currentHour === 23 && currentMinute === 0 && isSignedIn) {
                handleSignIn();
            }
        };
        const intervalId = setInterval(checkAutomaticSignOut, 60000);
        return () => clearInterval(intervalId);
    }, [isSignedIn]);

    useEffect(() => {
        // Check local storage on component load
        const savedSignInStatus = localStorage.getItem(`isSignedIn_${employeeId}`);
        if (savedSignInStatus === 'true') {
            setIsSignedIn(true);
            setButtonText('Sign Out');
        }
    }, [employeeId]);

    const handleSignIn = async () => {
        const dateDocId = new Date().toISOString().split('T')[0];
        const employeeDocRef = doc(fireDB, 'EMP_SIGNIN_SIGNOUT', employeeId);

        const currentHours = new Date().getHours();
        const shiftType = currentHours >= 3 && currentHours < 12 ? "A" :
                          currentHours >= 11 && currentHours < 20 ? "B" : "C";

        try {
            if (!isSignedIn) {
                // Sign-in logic
                await setDoc(employeeDocRef, {
                    [dateDocId]: {
                        employeeName: fullName,
                        designation: designation,
                        signInDate: new Date().toLocaleDateString('en-GB'),
                        signInTime: new Date().toLocaleTimeString(),
                        signOutTime: '',
                        isSignedIn: true,
                        shiftType: shiftType
                    }
                }, { merge: true });

                Swal.fire({
                    title: 'Sign-in Successful',
                    text: 'You have successfully signed in!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Update local storage and state
                localStorage.setItem(`isSignedIn_${employeeId}`, 'true');
                setButtonText('Sign Out');
                setIsSignedIn(true);
            } else {
                // Sign-out logic
                await updateDoc(employeeDocRef, {
                    [`${dateDocId}.signOutTime`]: new Date().toLocaleTimeString(),
                    [`${dateDocId}.isSignedIn`]: false,
                });

                Swal.fire({
                    title: 'Sign-out Successful',
                    text: 'You have successfully signed out!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                // Update local storage and state
                localStorage.setItem(`isSignedIn_${employeeId}`, 'false');
                setButtonText('Sign Out');  // Keep button as 'Sign Out' even after signing out
                setIsSignedIn(false);
            }
        } catch (error) {
            console.error('Error saving sign-in/sign-out data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to save sign-in/sign-out data. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    return (
        <div className={card.cards}>
            <div className={card.cards1}>
                <div class={card.card}>
                    <strong className={card.cheader}>Review</strong>
                    <div className={card.in}>
                        <div>
                            <img src={illu} />
                            <p> Hurrah! You've nothing to review.</p>
                        </div>
                    </div>
                </div>

                <div class={card.cardin1}>
                    <strong className={card.cheader}>Quick Access</strong>
                    <div className={card.in1}>
                        <div>
                            <p>IT Statements</p>
                            <p>YTD Reports</p>
                            <p>Loan Statements</p>
                        </div>
                        <div className={card.intxt}>
                            <p className={card.intxtPara}>Use Quick Access to view important salary details</p>
                        </div>
                    </div>
                </div>

                <div class={card.cardin2}>
                    <strong className={card.cheader}>Track</strong>
                    <div className={card.in}>
                        <div>
                            <img src={track} />
                            <p>All good you have nothing to track.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={card.cards2}>
                <div class={card.cardin5}>
                    <div className={card.inSignIn}>
                        <div className={card.top}>
                            <div className={card.dates}>
                                <span>{currentDate}</span>
                                <span className={card.light}>{currentDay} | General</span>
                                <span>{currentTime}</span>
                            </div>
                            <div className={card.dot}></div>
                        </div>
                        <div className={card.bottom}>
                            <span onClick={togglePopup} style={{ cursor: 'pointer' }}>View Swipes</span>
                            <button onClick={handleSignIn}>{buttonText}</button>
                        </div>
                    </div>
                </div>

                <div class={card.cardin3}>
                    <strong className={card.cheader}>Payslip</strong>
                    <div className={card.in10}>
                        <div>
                            <img src={payslip} />
                            <p> Uh oh! Your Payslip will show up here after the release of Payroll</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className={card.cards3}>
                <div class={card.cardin3}>
                    <strong className={card.cheader}>Upcoming Holidays</strong>
                    <div className={card.in11}>
                        <div>
                            <div className={card.ho}>
                                <span className={card.holiday}>1 Nov</span><span> Friday</span>
                                <p className={card.holidayEvent}>Diwali Amavasya (Laxmi Pujan)</p>
                            </div>
                            <div className={card.ho}>
                                <span className={card.holiday}>2 Nov</span><span> Friday</span>
                                <p className={card.holidayEvent}>Diwali (Bali Pratipada)</p>
                            </div>
                            <div className={card.ho}>
                                <span className={card.holiday}>3 Nov</span><span> Friday</span>
                                <p className={card.holidayEvent}>Diwali</p>
                            </div>
                            <div className={card.ho}>
                                <span className={card.holiday}>25 Nov</span><span> Friday</span>
                                <p className={card.holidayEvent}>Xmas</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class={card.cardinIt}>
                    <strong className={card.cheader}>It Decleration</strong>
                    <div className={card.inSignIn}>
                        <div className={card.top}>
                            <div className={card.dates}>
                                <img src={ItDec} />
                                <p>Hold on! You can submit your Income Tax (IT) <br /> declaration once released.</p>
                            </div>
                        </div>
                        <div className={card.bottom}>

                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <div className={card.popup}>
                    <div className={card.popupContent}>
                        <button className={card.closeButton} onClick={togglePopup}>Close</button>
                        <Swipes fullName={fullName} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cards