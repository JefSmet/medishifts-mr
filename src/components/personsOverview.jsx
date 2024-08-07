import { useEffect } from 'react';
import DeletePerson from './deletePerson';
import PersonSelector from './personSelector';
import UpdatePerson from './updatePerson';
import axios from 'axios';
import { useState } from 'react';

const apiRoute = import.meta.env.VITE_API_ROUTE + '/persons';

export default function PersonsOverview() {
  const [persons, setPersons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiRoute)
      .then((response) => {
        setPersons(response.data);
        console.log('resonse', response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(persons);
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-bold">Persons</h1>
      </div>
      <div>
        <PersonSelector persons={persons} />
      </div>
      <UpdatePerson />
      <DeletePerson />
    </div>
  );
}
