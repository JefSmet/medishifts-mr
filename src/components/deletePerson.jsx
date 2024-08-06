import { useState } from 'react';
import axios from 'axios';
export default function DeletePerson({ id }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const apiRoute = import.meta.env.VITE_API_ROUTE + '/persons';

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${apiRoute}/${id}`);
      alert('Person successfully deleted');
    } catch (error) {
      alert('Error deleting person');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <button
        type="button"
        className="mt-10 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Delete
      </button>
    </div>
  );
}
