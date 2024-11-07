import React, { useState, useEffect } from 'react'
import card from './Cards.module.css';
import illu from '../../../assets/gt_illustration_6.svg';
import track from '../../../assets/track.svg';
import payslip from '../../../assets/payslip.svg';
import ItDec from '../../../assets/itDec.svg';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { fireDB } from '../../Firebase/FirebaseConfig';
import Swipes from './Swpies/Swipes';

const Cards = () => {
    const [currentDate, setCurrentDate] = useState('');
    const [currentDay, setCurrentDay] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const location = useLocation();
    const employeeId = location.state?.employeeId
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [designation, setDesignation] = useState('');
    const [fullName, setFullName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDate(now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
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
            if (fullName) {  // Run only when fullName has a value
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

    const handleSignIn = async () => {
        const dateDocId = new Date().toISOString().split('T')[0];
        const employeeDocRef = doc(fireDB, 'EMP_SIGNIN_SIGNOUT', `${fullName} ${dateDocId}`);

        const currentHours = new Date().getHours();
        let shiftType;

        if (currentHours >= 3 && currentHours < 12) {
            shiftType = "A"; 
        } else if (currentHours >= 11 && currentHours < 20) {
            shiftType = "B"; 
        } else {
            shiftType = "C"; 
        }

        try {
            if (!isSignedIn) {
                await setDoc(employeeDocRef, {
                    employeeName: fullName,
                    designation: designation,
                    signInDate: currentDate,
                    signInDay: currentDay,
                    signInTime: currentTime,
                    signOutTime: '',
                    isSignedIn: true,
                    shiftType: shiftType
                }, { merge: true });
                alert('Sign-in successfull.');
            } else {
                await setDoc(employeeDocRef, {
                    signOutTime: currentTime,
                    isSignedIn: false,
                }, { merge: true });
                alert('Sign-out successfull.');
            }
            setIsSignedIn(!isSignedIn);
        } catch (error) {
            console.error('Error saving sign-in data:', error);
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
                            <button onClick={handleSignIn}>{isSignedIn ? 'Sign Out' : 'Sign In'}</button>
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