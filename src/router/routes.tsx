// routes.tsx
import { lazy } from 'react';

import ProtectedRoute from './ProtectRoutes'
import Error from '../components/Error';
import Profile from '../pages/Pages/Admin/Profile';
import AccountSetting from '../pages/Pages/Admin/AccountSetting';
import Users from '../pages/Pages/Admin/UserDetails';
import ReportedUserList from '../components/User/ReportedUserDetails';
import ListAllProduct from '../components/Ecommerce/Product/ListAllProduct';
import AddProduct from '../pages/Pages/Ecom/Admin/AddProduct';
import ViewProductById from '../components/Ecommerce/Product/ViewProductById';
import EditProductForm from '../components/Ecommerce/Product/EditProduct';
import ListAllPost from '../components/Social/Post/ListAllPost';


const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const Index = lazy(() => import('../pages/Index'));

const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ),
    layout: 'default',
  },

  // Login Logout
  {
    path: '/auth/Login',
    element: <LoginBoxed />,
    layout: 'blank',
  },

  // Admin Profile
  {
    path: '/users/profile',
    element: (<ProtectedRoute>
      <Profile />,
    </ProtectedRoute>)
  },
  {
    path: '/users/user-account-settings',
    element: (<ProtectedRoute>
      <AccountSetting />
    </ProtectedRoute>),
  },
  {
    path: '/users/user-details',
    element: (<ProtectedRoute>
      <Users />
    </ProtectedRoute>),
  },
  {
    path: '/users/reported-user-list',
    element: (<ProtectedRoute>
      <ReportedUserList />
    </ProtectedRoute>),
  },
  {
    path: '/products/list-all-product',
    element: (<ProtectedRoute>
      <ListAllProduct />
    </ProtectedRoute>),
  },
  {
    path: '/products/ProductById',
    element: (<ProtectedRoute>
      <ViewProductById productId={undefined}/>
    </ProtectedRoute>),
  },
  {
    path: '/products/editProduct',
    element: (<ProtectedRoute>
      <EditProductForm productId={undefined}/>
    </ProtectedRoute>),
  },
  {
    path: '/products/add-new-Product',
    element: (<ProtectedRoute>
      <AddProduct/>
    </ProtectedRoute>),
  },

  // Socials
  {
    path: '/post/list-all-post',
    element: (<ProtectedRoute>
      <ListAllPost/>
    </ProtectedRoute>),
  },


  // else
  {
    path: '*',
    element: <Error />,
    layout: 'blank',
  },
];

export { routes };
