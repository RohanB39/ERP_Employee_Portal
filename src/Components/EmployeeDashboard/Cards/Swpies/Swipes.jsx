import React, { useEffect, useState } from 'react';
import { collection, getDocs, fireDB } from '../../../Firebase/FirebaseConfig'; // Adjust the import path as needed
import swipe from './Swipes.module.css';

const Swipes = ({ fullName }) => {
    const dateDocId = new Date().toISOString().split('T')[0];
    const docId = `${fullName} ${dateDocId}`;
    const [shiftDate] = useState(new Date().toLocaleDateString());
    const [shiftTime, setShiftTime] = useState("N/A"); // Initialize with a default value
    const [shiftType, setShiftType] = useState("Day");
    const [swipesData, setSwipesData] = useState([]);

    useEffect(() => {
        const determineShiftTime = (signInTime, signOutTime) => {
            const signInHour = new Date(signInTime).getHours();
            const signOutHour = new Date(signOutTime).getHours();

            // Shift times based on sign-in and sign-out hours
            if (signInHour >= 11 && signInHour < 22) {
                return "12 PM to 08 PM"; // Day Shift
            } else if ((signInHour >= 19) || (signOutHour < 6)) {
                return "08 PM to 04 AM"; // Night Shift
            } else if ((signInHour >= 2 && signInHour < 14)) {
                return "04 AM to 12 PM"; // Morning Shift
            }

            return "N/A"; // Default case if none of the conditions are met
        };

        const fetchSwipesData = async () => {
            try {
                const querySnapshot = await getDocs(collection(fireDB, "EMP_SIGNIN_SIGNOUT"));
                const matchingSwipes = querySnapshot.docs
                    .filter(doc => doc.id === docId)
                    .map(doc => ({
                        id: doc.id,
                        shiftType: doc.data().shiftType,
                        ...doc.data()
                    }));

                if (matchingSwipes.length > 0) {
                    setShiftType(matchingSwipes[0].shiftType);
                    
                    if (matchingSwipes[0].signInTime && matchingSwipes[0].signOutTime) {
                        const shiftTimeFromSignIn = determineShiftTime(matchingSwipes[0].signInTime, matchingSwipes[0].signOutTime);
                        setShiftTime(shiftTimeFromSignIn);
                    }
                }
                
                setSwipesData(matchingSwipes);
            } catch (error) {
                console.error("Error fetching swipes data:", error);
            }
        };

        fetchSwipesData();
    }, [docId]);

    return (
        <div className={swipe.popupContainer}>
            <h1>Swipes</h1>
            <div className={swipe.detailsSection}>
                <p><strong>Date:</strong> {shiftDate}</p>
                <p><strong>Shift Time:</strong> {shiftTime}</p>
                <p><strong>Shift Type:</strong> {shiftType}</p>
            </div>
            <div className={swipe.tableContainer}>
                <table className={swipe.swipesTable}>
                    <thead>
                        <tr>
                            <th>Sign In Time</th>
                            <th>Sign Out Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {swipesData.length > 0 ? (
                            swipesData.map((swipe) => (
                                <tr key={swipe.id}>
                                    <td>{swipe.signInTime || "N/A"}</td>
                                    <td>{swipe.signOutTime || "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Swipes;
