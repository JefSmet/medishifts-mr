import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateUserRole = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Haal rollen op bij het laden van de component
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_ROUTE + 'user_roles',
        );
        setRoles(response.data);
      } catch (err) {
        setError('Fout bij het ophalen van rollen.');
      }
    };

    fetchRoles();
  }, []);

  const removeRole = async (roleId) => {
    try {
      await axios.delete(
        import.meta.env.VITE_API_ROUTE + `user_roles/${roleId}`,
      );
      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (err) {
      setError('Er is een fout opgetreden bij het verwijderen van de rol.');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Valideer de invoer
    if (!roleName) {
      setError('Rolnaam is vereist.');
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_ROUTE + 'user_roles',
        {
          role: roleName,
        },
      );

      if (response.status === 201) {
        setSuccess(true);
        setRoleName('');
        setRoles([...roles, response.data]);
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het aanmaken van de rol.');
      console.error(err);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded border p-4">
      <h2 className="mb-4 text-xl font-bold">Gebruikersrol Aanmaken</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && (
        <div className="mb-4 text-green-500">
          Gebruikersrol succesvol aangemaakt!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="roleName" className="block text-gray-700">
            Rolnaam:
          </label>
          <input
            type="text"
            id="roleName"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 py-2 text-white"
        >
          Aanmaken
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Bestaande Rollen</h3>
        <ul>
          {roles.map((role) => (
            <li key={role.id} className="mt-2 flex items-center">
              {role.role}
              <button
                type="button"
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() => removeRole(role.id)}
              >
                Verwijderen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateUserRole;
