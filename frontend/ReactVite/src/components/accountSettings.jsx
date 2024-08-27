import { useEffect, useState } from 'react';
import { parseJwt } from '../utils/tokenStorage';

export default function AccountSettings() {
  const [userData, setUserData] = useState({
    username: '',
  });
  const [personData, setPersonData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '', // Zorg ervoor dat dit een lege string is
  });
  const [password, setPassword] = useState('');

  const payload = parseJwt(localStorage.getItem('jwtToken'));
  const userId = payload.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch(
          `${import.meta.env.VITE_API_ROUTE}users/${userId}`,
        );
        const personResponse = await fetch(
          `${import.meta.env.VITE_API_ROUTE}persons/${userId}`,
        );
        const user = await userResponse.json();
        const person = await personResponse.json();
        setUserData({
          username: user.user_name || '', // Fallback naar lege string als undefined
        });

        setPersonData({
          firstName: person.first_name || '',
          lastName: person.last_name || '',
          birthDate: person.date_of_birth || '', // Fallback naar lege string als undefined
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData();
  }, [userId]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Prepare the user data for update
      const userUpdateData = {
        user_name: userData.username,
      };

      // Only include password if it's not empty
      if (password) {
        userUpdateData.password = password;
      }

      // Update user data
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_ROUTE}users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userUpdateData),
        },
      );

      // Update person data
      const personResponse = await fetch(
        `${import.meta.env.VITE_API_ROUTE}persons/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: personData.firstName,
            last_name: personData.lastName,
            date_of_birth: personData.birthDate,
          }),
        },
      );

      if (userResponse.ok && personResponse.ok) {
        alert('Account updated successfully!');
      } else {
        alert('Failed to update account.');
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto">
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md"
        style={{ marginTop: '-20vh' }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Account Information
        </h2>
        <form onSubmit={handleSave}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Voornaam
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={personData.firstName}
                onChange={(e) =>
                  setPersonData({ ...personData, firstName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Achternaam
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={personData.lastName}
                onChange={(e) =>
                  setPersonData({ ...personData, lastName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Geboortedatum
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={personData.birthDate}
                onChange={(e) =>
                  setPersonData({ ...personData, birthDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
