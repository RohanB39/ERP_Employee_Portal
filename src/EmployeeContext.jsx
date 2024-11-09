import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employeeId, setEmployeeId] = useState(null); // Initialize employeeId state

    return (
        <EmployeeContext.Provider value={{ employeeId, setEmployeeId }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => useContext(EmployeeContext);
