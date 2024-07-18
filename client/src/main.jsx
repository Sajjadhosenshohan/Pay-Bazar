import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthProvider from './Auth/AuthProvider';
import SendMoney from './pages/SendMoney';
import CashOutForm from './pages/CashOutForm';
import CashInForm from './pages/CashIn';
import AllUserList from './pages/Admin/AllUserList';
import BalanceRequest from './pages/Agent/BalanceRequest';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },

      {
        path: "/send-money",
        element: <SendMoney />
      },

      {
        path: "/cashOut",
        element: <CashOutForm />
      },
      {
        path: "/cashIn",
        element: <CashInForm />
      },

      {
        path: "/allUserList",
        element: <AllUserList />
      },
      {
        path: "/balanceRequest",
        element: <BalanceRequest />
      },
    ]

  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
