import axios from 'axios'; // Import the axios module
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/persons');
        setPersons(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.last_name}</li>
        ))}
      </ul>
    </div>
  );
}
