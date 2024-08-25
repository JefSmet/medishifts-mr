import React from 'react';

function DownloadICSButton({ token, activityTypes }) {
  const generateICSUrl = (token, activityTypes) => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}ics/${token}`;
    const query = activityTypes
      ? `?activity_types=${activityTypes.join(',')}`
      : '';
    return `${baseUrl}${query}`;
  };

  return (
    <a href={generateICSUrl(token, activityTypes)} download="calendar.ics">
      <button className="rounded bg-blue-500 px-4 py-2 text-white">
        Download ICS
      </button>
    </a>
  );
}

export default DownloadICSButton;
