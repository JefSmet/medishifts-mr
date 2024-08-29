import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateProfile() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [userRoles, setUserRoles] = useState([]);
  const [isNew, setIsNew] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    last_name: '',
    first_name: '',
    date_of_birth: '',
    user_name: '',
    password: '',
    doctors: [
      {
        id: '',
        riziv_PK: '',
        qualification_code: '',
        qualification_name: '',
      },
    ],
  });
  const [renderTrigger, setRenderTrigger] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDoctorChange = (e, index) => {
    const { name, value } = e.target;
    const updatedDoctors = [...formData.doctors];
    updatedDoctors[index] = {
      ...updatedDoctors[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      doctors: updatedDoctors,
    }));
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_ROUTE}users-profiles`)
      .then((response) => {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`${import.meta.env.VITE_API_ROUTE}user_roles`)
      .then((response) => {
        setUserRoles(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleDoctorListClick(event) {
    setIsNew(false);
    const selectedUserId = event.target.value;
    const selectedUserData = users.find((user) => user.id === selectedUserId);
    setSelectedUser(selectedUserData);
    console.log(selectedUserData);
    setFormData({
      id: selectedUserData.id,
      last_name: selectedUserData.last_name,
      first_name: selectedUserData.first_name,
      date_of_birth: selectedUserData.date_of_birth,
      user_name: selectedUserData.user.user_name,
      user_role_id: selectedUserData.user.user_role.id,
      password: '',
      doctors: selectedUserData.doctors,
    });
  }
  function renderDoctorList() {
    return (
      <div className="w-1/4 p-4">
        <h2 className="mb-4 text-base font-semibold leading-7 text-gray-900">
          Doctors
        </h2>
        {users.map((user) => (
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-100"
            key={user.id}
          >
            <option value={user.id} onClick={handleDoctorListClick}>
              {user.first_name} {user.last_name}
            </option>
            <button
              className="text-red-600 transition duration-150 ease-in-out hover:text-red-900 focus:outline-none"
              onClick={() => handleRemove(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }

  function handleRemove(userId) {
    axios
      .delete(`${import.meta.env.VITE_API_ROUTE}users/${userId}`)
      .then(() => {
        console.log('User deleted');
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted: ', formData);

    const {
      id,
      last_name,
      first_name,
      date_of_birth,
      user_name,
      doctors,
      password,
      user_role_id,
    } = formData;

    if (isNew) {
      axios
        .post(`${import.meta.env.VITE_API_ROUTE}persons`, {
          last_name,
          first_name,
          date_of_birth,
        })
        .then((response) => {
          const newPersonId = response.data.id;
          axios
            .post(`${import.meta.env.VITE_API_ROUTE}users`, {
              person_id: newPersonId,
              user_name,
              user_role_id,
              password,
            })
            .then(() => {
              axios
                .post(`${import.meta.env.VITE_API_ROUTE}doctors`, {
                  person_id: newPersonId,
                  qualification_code: doctors[0].qualification_code,
                  qualification_name: doctors[0].qualification_name,
                  riziv_PK: doctors[0].riziv_PK,
                })
                .then(() => {
                  console.log('All models created');
                  setRenderTrigger((prev) => !prev); // Trigger a re-render
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      if (password && password.trim().length > 0) {
        axios
          .put(`${import.meta.env.VITE_API_ROUTE}persons/${id}`, {
            last_name,
            first_name,
            date_of_birth,
          })
          .then(() => {
            axios
              .put(`${import.meta.env.VITE_API_ROUTE}users/${id}`, {
                user_name,
                user_role_id,
                password,
              })
              .then(() => {
                axios
                  .put(
                    `${import.meta.env.VITE_API_ROUTE}doctors/${doctors[0].id}`,
                    {
                      person_id: id,
                      qualification_code: doctors[0].qualification_code,
                      qualification_name: doctors[0].qualification_name,
                      riziv_PK: doctors[0].riziv_PK,
                    },
                  )
                  .then(() => {
                    console.log('All models updated');
                    setRenderTrigger((prev) => !prev); // Trigger a re-render
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axios
          .put(`${import.meta.env.VITE_API_ROUTE}persons/${id}`, {
            last_name,
            first_name,
            date_of_birth,
          })
          .then(() => {
            axios
              .put(`${import.meta.env.VITE_API_ROUTE}users/${id}`, {
                user_name,
                user_role_id,
              })
              .then(() => {
                axios
                  .put(
                    `${import.meta.env.VITE_API_ROUTE}doctors/${doctors[0].id}`,
                    {
                      person_id: id,
                      qualification_code: doctors[0].qualification_code,
                      qualification_name: doctors[0].qualification_name,
                      riziv_PK: doctors[0].riziv_PK,
                    },
                  )
                  .then(() => {
                    console.log('All models updated');
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    setUsers((users) => [...users, formData]);
  };

  function handleNewProfile() {
    setFormData({
      id: '',
      last_name: '',
      first_name: '',
      date_of_birth: '',
      user_name: '',
      password: '',
      doctors: [
        {
          id: '',
          riziv_PK: '',
          qualification_code: '',
          qualification_name: '',
        },
      ],
    });
    setSelectedUser({});
    setIsNew(true);
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50">
      {renderDoctorList()}
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-lg rounded-lg bg-white p-4 shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="last_name"
            className="mb-2 block font-bold text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="first_name"
            className="mb-2 block font-bold text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="date_of_birth"
            className="mb-2 block font-bold text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="user_name"
            className="mb-2 block font-bold text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="user_name"
            id="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="mb-2 block font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="user_role_id"
            className="mb-2 block font-bold text-gray-700"
          >
            User Role
          </label>
          <select
            name="user_role_id"
            id="user_role_id"
            value={formData.user_role_id ? formData.user_role_id : ''}
            onChange={handleChange}
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          >
            <option value="">Select a role</option>
            {userRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role}
              </option>
            ))}
          </select>
        </div>

        <h2 className="mb-4 text-lg font-bold">Doctor Information</h2>

        {formData.doctors.map((doctor, index) => (
          <div key={index} className="mb-4 rounded-md border p-4">
            <div className="mb-4">
              <label
                htmlFor={`riziv_PK_${index}`}
                className="mb-2 block font-bold text-gray-700"
              >
                Riziv PK
              </label>
              <input
                type="text"
                name="riziv_PK"
                id={`riziv_PK_${index}`}
                value={doctor.riziv_PK}
                onChange={(e) => handleDoctorChange(e, index)}
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`qualification_code_${index}`}
                className="mb-2 block font-bold text-gray-700"
              >
                Qualification Code
              </label>
              <input
                type="text"
                name="qualification_code"
                id={`qualification_code_${index}`}
                value={doctor.qualification_code}
                onChange={(e) => handleDoctorChange(e, index)}
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={`qualification_name_${index}`}
                className="mb-2 block font-bold text-gray-700"
              >
                Qualification Name
              </label>
              <input
                type="text"
                name="qualification_name"
                id={`qualification_name_${index}`}
                value={doctor.qualification_name}
                onChange={(e) => handleDoctorChange(e, index)}
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          >
            Submit
          </button>
          <button
            type="button"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            onClick={handleNewProfile}
          >
            Nieuw
          </button>
        </div>
      </form>
    </div>
  );
}
