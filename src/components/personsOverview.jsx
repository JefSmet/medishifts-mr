import { useEffect } from 'react';
import DeletePerson from './deletePerson';
import PersonSelector from './personSelector';
import UpdatePerson from './updatePerson';
import axios from 'axios';

const apiRoute = import.meta.env.VITE_API_ROUTE + '/persons';

export default function PersonsOverview() {
  let persons;
  useEffect(() => {
    axios
      .get(apiRoute)
      .then((response) => {
        persons = response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-bold">Persons</h1>
      </div>
      <div>
        <PersonSelector />
      </div>
      <UpdatePerson />
      <DeletePerson />
    </div>
  );
}
