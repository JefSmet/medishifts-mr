function DownloadAllDoctorsICSButton({ token, activityTypes }) {
  const generateICSUrl = (token, activityTypes) => {
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}ics/all-doctors/${token}`;
    const query = activityTypes
      ? `?activity_types=${activityTypes.join(',')}`
      : '';
    return `${baseUrl}${query}`;
  };

  return (
    <a
      href={generateICSUrl(token, activityTypes)}
      download="all-doctors-calendar.ics"
    >
      <button className="rounded bg-green-500 px-4 py-2 text-white">
        Download All Doctors ICS
      </button>
    </a>
  );
}

export default DownloadAllDoctorsICSButton;
