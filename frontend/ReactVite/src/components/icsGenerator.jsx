import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IcsGenerator() {
  const [icsToken, setIcsToken] = useState('');
  const [queryString, setQueryString] = useState('');
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
  const [token, setToken] = useState('');
  const [copiedState, setCopiedState] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (!storedToken) {
      console.error('JWT token not found');
    }
    setToken(storedToken);
    const fetchActivityTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ROUTE}activity_types`,
          {
            headers: {
              Authorization: storedToken,
            },
          },
        );
        console.log('Activity types:', response.data);
        setActivityTypes(response.data);
      } catch (error) {
        console.error('Error fetching activity types:', error);
      }
    };

    fetchActivityTypes();
  }, []);

  const handleGenerateLink = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ROUTE}get-ics-token`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      console.log('ICS Token Response:', response.data);
      const icsToken = response.data.ics_token;
      setQueryString(selectedActivityTypes.join(','));
      setIcsToken(`${icsToken}`);
    } catch (error) {
      console.error('Error generating ICS link:', error);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedActivityTypes([...selectedActivityTypes, value]);
    } else {
      setSelectedActivityTypes(
        selectedActivityTypes.filter((type) => type !== value),
      );
    }
  };

  const handleCopyToClipboard = (text, buttonId) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prevState) => ({
      ...prevState,
      [buttonId]: true,
    }));
    setTimeout(() => {
      setCopiedState((prevState) => ({
        ...prevState,
        [buttonId]: false,
      }));
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Generate ICS Link</h1>
        <div className="mb-4">
          <h2 className="mb-2 text-lg font-semibold">Select Activity Types</h2>
          {activityTypes.map((type) => (
            <div key={type.id} className="mb-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={type.id}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{type.name}</span>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerateLink}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Generate Link
        </button>
        {icsToken && (
          <div className="mt-4">
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={`${import.meta.env.VITE_API_ROUTE}ics/${icsToken}?activity_types=${queryString}`}
                className="w-full rounded border border-gray-300 px-2 py-1"
              />
              <button
                className="ml-2 rounded border border-gray-300 px-2 py-1"
                onClick={() =>
                  handleCopyToClipboard(
                    `${import.meta.env.VITE_API_ROUTE}ics/${icsToken}?activity_types=${queryString}`,
                    'button1',
                  )
                }
                disabled={copiedState['button1']}
              >
                {copiedState['button1'] ? 'Copied' : 'Copy to clipboard'}
              </button>
            </div>
            <div className="mt-2 flex items-center">
              <input
                type="text"
                readOnly
                value={`${import.meta.env.VITE_API_ROUTE}ics/all-doctors/${icsToken}?activity_types=${queryString}`}
                className="w-full rounded border border-gray-300 px-2 py-1"
              />
              <button
                className="ml-2 rounded border border-gray-300 px-2 py-1"
                onClick={() =>
                  handleCopyToClipboard(
                    `${import.meta.env.VITE_API_ROUTE}ics/all-doctors/${icsToken}?activity_types=${queryString}`,
                    'button2',
                  )
                }
                disabled={copiedState['button2']}
              >
                {copiedState['button2'] ? 'Copied' : 'Copy to clipboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IcsGenerator;
