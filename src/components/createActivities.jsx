import { useState } from 'react';
import axios from 'axios';

const apiRoute = import.meta.env.VITE_API_ROUTE + '/activities';

export default function CreateActivity() {
  const [formData, setFormData] = useState({
    person_id: '',
    activity_type_id: '',
    begin_DT: '',
    end_DT: '',
    status: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(apiRoute, formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Activiteit Informatie
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Vul de informatie van de nieuwe activiteit in.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label
                htmlFor="person_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Persoon ID <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="person_id"
                  name="person_id"
                  type="text"
                  value={formData.person_id}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="activity_type_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Activiteit Type ID <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="activity_type_id"
                  name="activity_type_id"
                  type="text"
                  value={formData.activity_type_id}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="begin_DT"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Begin Datum <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="begin_DT"
                  name="begin_DT"
                  type="date"
                  value={formData.begin_DT}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="end_DT"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Eind Datum <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="end_DT"
                  name="end_DT"
                  type="date"
                  value={formData.end_DT}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
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
  );
}
