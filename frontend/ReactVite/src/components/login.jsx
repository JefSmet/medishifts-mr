import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../utils/apiJWT';
import { storeToken } from '../utils/tokenStorage';

const apiRoute = import.meta.env.VITE_API_ROUTE;
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [jwtToken, setjwtToken] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await api.post(apiRoute + 'login', {
        username,
        password,
      });

      if (response.data.success) {
        const token = response.data.token;

        // Sla de token op in AsyncStorage (mobiel) of sessionStorage (web)

        setjwtToken(token);

        // Stel de token in voor toekomstige API-aanroepen
        setAuthToken(token);

        // Navigeren naar een andere pagina of scherm na succesvolle login
        window.location.href = '/dashboard'; // Voor web: navigeer naar dashboard
      }
    } catch (error) {
      console.error(error.message);
      if (error.response) {
        error.response.status === 401
          ? setErrorMessage('Login mislukt: Onjuiste inloggegevens')
          : setErrorMessage('Er is iets misgegaan. Probeer het later opnieuw.');
      } else {
        setErrorMessage('Er is iets misgegaan. Probeer het later opnieuw.');
      }
    }
  }
  useEffect(() => {
    if (jwtToken) {
      // localStorage.setItem('jwtToken', jwtToken);
      storeToken(jwtToken);
    }
  }, [jwtToken]);
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Medshifts"
            src="src/icons/logo-az-monica.svg"
            className="mx-auto mt-0 h-60 w-auto"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} method="POST" className="space-y-6">
            <div>
              {errorMessage && (
                <p className="mb-2 text-center text-red-500">{errorMessage}</p>
              )}
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
