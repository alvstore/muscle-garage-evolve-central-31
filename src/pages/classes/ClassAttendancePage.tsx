
import React from 'react';

const ClassAttendancePage = () => {
  // Example data transformation
  const transformAttendanceData = (data: any) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      id: item.id || '',
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      // Add other properties as needed
    }));
  };

  // Usage
  const fetchedData = []; // Replace with actual data fetch
  const attendanceData = transformAttendanceData(fetchedData);

  // Now we can safely access properties on individual items, not on the array itself
  const displayData = () => {
    return attendanceData.map(member => (
      <div key={member.id}>
        <p>Name: {member.name}</p>
        <p>Email: {member.email}</p>
        <p>Phone: {member.phone}</p>
      </div>
    ));
  };

  return (
    <div>
      <h1>Class Attendance</h1>
      {displayData()}
    </div>
  );
};

export default ClassAttendancePage;
