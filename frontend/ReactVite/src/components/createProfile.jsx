import { useState, useEffect } from 'react';

export default function FullProfileForm() {
  const [doctors, setDoctors] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    username: '',
    password: '',
    userRole: '',
    rizivPK: '',
    qualificationCode: '',
    qualificationName: '',
  });

  useEffect(() => {
    // Fetch the list of doctors from the API
    fetch(import.meta.env.VITE_API_ROUTE + 'doctors')
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctorId(data[0].id); // Select the first doctor by default
        }
      });

    // Fetch the list of user roles from the API
    fetch(import.meta.env.VITE_API_ROUTE + 'user_roles')
      .then((response) => response.json())
      .then((data) => setUserRoles(data));
  }, []);

  useEffect(() => {
    if (selectedDoctorId && !isCreatingNew) {
      // Fetch the selected doctor's details from the API and populate the form
      fetch(import.meta.env.VITE_API_ROUTE + `doctors/${selectedDoctorId}`)
        .then((response) => response.json())
        .then((data) => {
          fetch(import.meta.env.VITE_API_ROUTE + `persons/${data.person_id}`)
            .then((response) => response.json())
            .then((personData) => {
              setFormData({
                firstName: personData.first_name,
                lastName: personData.last_name,
                dateOfBirth: personData.date_of_birth,
                username: '', // Assuming you'd want to fetch this separately
                password: '',
                userRole: '', // Assuming you'd want to fetch this separately
                rizivPK: data.riziv_PK,
                qualificationCode: data.qualification_code,
                qualificationName: data.qualification_name,
              });
            });
        });
    }
  }, [selectedDoctorId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = isCreatingNew
      ? import.meta.env.VITE_API_ROUTE + 'persons-doctors'
      : import.meta.env.VITE_API_ROUTE + `doctors/${selectedDoctorId}`;
    const method = isCreatingNew ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        person: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
        },
        doctor: {
          riziv_PK: formData.rizivPK,
          qualification_code: formData.qualificationCode,
          qualification_name: formData.qualificationName,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isCreatingNew) {
          setDoctors([...doctors, data]);
          setIsCreatingNew(false);
          setSelectedDoctorId(data.doctor.id);
        }
      });
  };

  const handleNewDoctor = () => {
    setIsCreatingNew(true);
    setSelectedDoctorId(null);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      username: '',
      password: '',
      userRole: '',
      rizivPK: '',
      qualificationCode: '',
      qualificationName: '',
    });
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50">
      <div className="w-1/4 p-4">
        <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
          Doctors
        </h2>
        <ul className="space-y-2">
          {doctors.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => {
                setSelectedDoctorId(doctor.id);
                setIsCreatingNew(false);
              }}
              className={`cursor-pointer p-2 ${selectedDoctorId === doctor.id ? 'bg-indigo-100' : ''}`}
            >
              {doctor.person.last_name} {doctor.person.first_name} -{' '}
              {doctor.qualification_name}
            </li>
          ))}
        </ul>
        <button
          onClick={handleNewDoctor}
          className="mt-4 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
        >
          Create New Doctor
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-3/4 max-w-2xl space-y-12 rounded-lg bg-white p-8 shadow-md"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {isCreatingNew ? 'New Doctor' : 'Complete Profile Information'}
          </h2>
          {!isCreatingNew && (
            <button
              onClick={handleNewDoctor}
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Create New Doctor
            </button>
          )}
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date of Birth
            </label>
            <div className="mt-2">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
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
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="userRole"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              User Role
            </label>
            <div className="mt-2">
              <select
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option value="">Select a role</option>
                {userRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="rizivPK"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              RIZIV PK
            </label>
            <div className="mt-2">
              <input
                id="rizivPK"
                name="rizivPK"
                type="text"
                value={formData.rizivPK}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="qualificationCode"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Qualification Code
            </label>
            <div className="mt-2">
              <input
                id="qualificationCode"
                name="qualificationCode"
                type="text"
                value={formData.qualificationCode}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="qualificationName"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Qualification Name
            </label>
            <div className="mt-2">
              <input
                id="qualificationName"
                name="qualificationName"
                type="text"
                value={formData.qualificationName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
