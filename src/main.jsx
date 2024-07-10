import * as React from 'react';
import * as ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';
import './index.css';
import MonthActivityView from './routes/monthActivities.jsx';
import Root from './routes/root.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}     
      errorElement={<ErrorPage />} 
    >    
      <Route 
        path="monthActivities/" 
        element={<MonthActivityView />} />  
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
