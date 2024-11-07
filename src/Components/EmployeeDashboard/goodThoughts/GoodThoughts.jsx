import React, { useEffect, useState } from 'react';
import style from './GoodThoughts.module.css';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../Firebase/FirebaseConfig';

const GoodThoughts = () => {
    const location = useLocation();
    const employeeId = location.state?.employeeId;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [greeting, setGreeting] = useState('');
    const [thought, setThought] = useState('');

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const employeeDocRef = doc(fireDB, 'employees', employeeId);
                const employeeDoc = await getDoc(employeeDocRef);
                if (employeeDoc.exists()) {
                    const { personalInfo } = employeeDoc.data();
                    if (personalInfo && personalInfo.firstName) {
                        setFirstName(personalInfo.firstName);
                        setLastName(personalInfo.lastName);
                    } else {
                        setError('First name not found in personalInfo.');
                    }
                    if (personalInfo.lastName) {
                        setLastName(personalInfo.lastName); // Fetch lastName
                    } else {
                        setError('Last name not found in personalInfo.');
                    }

                } else {
                    setError('Employee not found.');
                }
            } catch (error) {
                console.error('Error fetching employee data:', error);
                setError('Failed to fetch employee data.');
            }
        };

        const determineGreeting = () => {
            const currentHour = new Date().getHours();
            if (currentHour < 12) {
                setGreeting('Good Morning');
            } else if (currentHour < 17) {
                setGreeting('Good Afternoon');
            } else {
                setGreeting('Good Evening');
            }
        };

        const getRandomThought = () => {
            const randomIndex = Math.floor(Math.random() * thoughtsArray.length);
            setThought(thoughtsArray[randomIndex]);
        };

        if (employeeId) {
            fetchEmployeeData();
        }
        determineGreeting();
        getRandomThought();
    }, [employeeId]);

    const thoughtsArray = [
        { text: "The quickest way to double your money is to fold it over and put it back in your pocket.", author: "Will Rogers" },
        { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
        { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
        { text: "Opportunities don't happen, you create them.", author: "Chris Grosser" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" }
    ];

    return (
        <div className={style.goodthought}>
            <h1> <span className={style.greet}>{greeting}</span> {firstName || ''} {lastName || 'User'}</h1>
            <p>{thought.text}</p>
            <p>- {thought.author}</p>
            {error && <p className={style.error}>{error}</p>}
        </div>
    );
};

export default GoodThoughts;
