import { Form, useActionData, redirect } from 'react-router-dom';
import axios from 'axios';

const apiRoute = import.meta.env.VITE_API_ROUTE + '/user_roles';

export async function action({ request }) {
  const formData = await request.formData();
  const data = {
    user_id: formData.get('user_id'),
    role: formData.get('role'),
  };

  try {
    const response = await axios.post(apiRoute, data);
    return redirect('/');
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export default function CreateUserRole() {
  return (
    <Form method="post">
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Gebruikersrol informatie
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Vul hier de gegevens van de gebruikersrol in.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="user_id"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Gebruiker ID
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Rol
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="role"
                  name="role"
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Opslaan
        </button>
      </div>
    </Form>
  );
}
