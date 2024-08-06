import axios from 'axios';
import { Link } from 'react-router-dom';
export default function updatePerson({ id }) {
  const apiRoute = import.meta.env.VITE_API_ROUTE + '/persons';

  return (
    <div className="flex items-center gap-x-2">
      <Link
        to="/werkrooster"
        type="button"
        className="mt-10 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        Update
      </Link>
    </div>
  );
}
