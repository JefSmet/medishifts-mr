import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import TestApp from './TestApp';
import ErrorPage from './error-page';
import Navigation from './components/navigation';
import Settings from './pages/Settings';
import PersonsForm from './components/PersonsForm';
import HomePage from './HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigation />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: '/wachtlijst', element: <TestApp /> },
          { path: '/settings', element: <Settings /> },
          { path: '/createPerson', element: <PersonsForm /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
