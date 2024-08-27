import axios from 'axios'; // Import the axios module
import { useEffect, useState } from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{localStorage.getItem('jwtToken')}</p>
    </div>
  );
}
