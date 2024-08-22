import { PencilIcon } from '@heroicons/react/24/solid';

export default function AccountSettings() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Account Information
        </h2>
        <form>
          <div className="space-y-3">
            {/* Profile Picture Section */}
            <div className="mb-3 flex items-center justify-center">
              <div className="relative">
                <img
                  className="h-20 w-20 rounded-full"
                  src="https://via.placeholder.com/150"
                  alt="Current Profile"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-indigo-600 p-1.5"
                  style={{ backgroundColor: '#6366F1' }}
                >
                  <PencilIcon className="h-4 w-4 text-white" />
                </label>
                <input id="file-upload" type="file" className="hidden" />
              </div>
            </div>

            {/* Other form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="Filip12"
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Voornaam
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="Tom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Achternaam
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="Cook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Geboorte datum
              </label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-2 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
              style={{
                backgroundColor: '#6366F1',
                padding: '8px 16px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
