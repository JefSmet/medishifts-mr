import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';
import './index.css';
import Werkrooster from './routes/werkrooster.jsx';
import Root from './routes/root.jsx';
// import Dashboard from './components/dashboard.jsx';
import CreateActivityType from './components/createActivityType.jsx';
import { loader as werkroosterLoader } from './routes/werkrooster.jsx';
import { action as createActivityTypeAction } from './components/createActivityType.jsx';
import CreatePerson from './components/createPerson.jsx';
import { action as createPersonAction } from './components/createPerson.jsx';
// import PersonsOverview from './components/personsOverview.jsx';
import UpdateUsers from './components/updatePersons.jsx';
import UpdateActivityType from './components/updateActivityType.jsx';
import Login from './components/login.jsx';
import AddProfile from './routes/addProfile.jsx';
import Settings from './routes/settings.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route
        path="werkrooster/"
        element={<Werkrooster />}
        loader={werkroosterLoader}
      />
      <Route
        path="dashboard/"
        element={<Login />}
        action={createPersonAction}
      />
      <Route path="addProfile/" element={<AddProfile />} />
      <Route path="settings/" element={<Settings />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route
//             path="/"
//             element={<Root />}
//             loader={rootLoader}
//             action={rootAction}
//             errorElement={<ErrorPage />}
//         >
//             <Route errorElement={<ErrorPage />}>
//                 <Route index element={<Index />} />
//                 <Route
//                     path="contacts/:contactId"
//                     element={<Contact />}
//                     loader={contactLoader}
//                     action={contactAction}
//                 />
//                 <Route
//                     path="contacts/:contactId/edit"
//                     element={<EditContact />}
//                     loader={contactLoader}
//                     action={editAction}
//                 />
//                 <Route
//                     path="contacts/:contactId/destroy"
//                     action={destroyAction}
//                 />
//             </Route>
//         </Route>,
//     ),
// );
