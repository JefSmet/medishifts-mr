import { Form, useActionData, redirect } from 'react-router-dom';
import axios from 'axios';

const apiRoute = import.meta.env.VITE_API_ROUTE + '/activity_types';

export async function action({ request }) {
  const formData = await request.formData();
  const data = {
    name: formData.get('ShiftName'),
    isWork: formData.get('IsWork')== 'on'? true: false,
    // StartTime: formData.get('StartTime'),
    // EndTime: formData.get('EndTime')
  };

  try {
    const response = await axios.post(apiRoute, data);
    console.log(response.activity_types);
    return redirect('/'); 
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}

export default function CreateActivityType() {
  const actionData = useActionData();

  return (
    <Form method="post">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            htmlFor="ShiftName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Shift naam
          </label>
          <div className="mt-2">
            <input
              id="ShiftName"
              name="ShiftName"
              type="text"
              placeholder="Voer hier de naam in voor de shift."
              aria-describedby="shift-name-description"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        {/* <div className="mt-6 sm:mx-auto sm:max-w-sm">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="StartTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start shift
              </label>
              <div className="mt-2">
                <input
                  type="time"
                  id="StartTime"
                  name="StartTime"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="EndTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Einde shift
              </label>
              <div className="mt-2">
                <input
                  type="time"
                  id="EndTime"
                  name="EndTime"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div> */}
        <div className="mt-6 sm:mx-auto sm:max-w-sm">
        <label
            htmlFor="IsWork"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Is het werk?
          </label>
          <input id="IsWork"
              name="IsWork"
              type="checkbox"
           />
        </div>
        <div className="mt-10 sm:mx-auto sm:max-w-sm">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Opslaan
          </button>
        </div>
        {actionData?.error && (
          <div className="mt-4 text-red-500">
            Er is een fout opgetreden: {actionData.error}
          </div>
        )}
      </div>
    </Form>
  );
}
