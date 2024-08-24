import { useState } from 'react';

export default function AddVerlof() {
  const [startDate, setStartDate] = useState('');

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  // Huidige datum in het formaat YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="mx-auto max-w-lg">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Verlof aanvragen
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Geef uw hier de gegevens van de verlof aan.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="begin_DT"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start datum
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    id="begin_DT"
                    name="begin_DT"
                    type="date"
                    placeholder="10/10/2022"
                    autoComplete="begin_DT"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={today} // Stelt de huidige datum in als minimum
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="end_DT"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Eind datum
              </label>
              <div className="mt-2">
                <input
                  id="end_DT"
                  name="end_DT"
                  type="date"
                  min={startDate || today} // Stelt de startdatum of vandaag in als minimum
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
          Annuleren
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Aanvragen
        </button>
      </div>
    </form>
  );
}
