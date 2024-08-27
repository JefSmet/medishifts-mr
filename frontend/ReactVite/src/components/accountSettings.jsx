import { PencilIcon } from '@heroicons/react/24/solid';

export default function AccountSettings() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto">
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md"
        style={{ marginTop: '-20vh' }}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Account Information
        </h2>
        <form>
          <div className="space-y-3">
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
