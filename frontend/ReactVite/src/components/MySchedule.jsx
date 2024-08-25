import React, { useEffect, useState } from 'react';
import DownloadICSButton from './DownloadICSButton';
import DownloadAllDoctorsICSButton from './DownloadAllDoctorsICSButton';

function MySchedule() {
  const [icsToken, setIcsToken] = useState(null);
  const activityTypes = ['work', 'leave']; // Een array van geselecteerde activity types

  useEffect(() => {
    const fetchIcsToken = async () => {
      try {
        const response = await fetch('/api/get-ics-token', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming JWT is stored in localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIcsToken(data.ics_token);
        } else {
          console.error('Failed to fetch ICS token');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchIcsToken();
  }, []);

  if (!icsToken) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Schedule</h1>
      <DownloadICSButton token={icsToken} activityTypes={activityTypes} />
      <DownloadAllDoctorsICSButton
        token={icsToken}
        activityTypes={activityTypes}
      />
    </div>
  );
}

export default MySchedule;
