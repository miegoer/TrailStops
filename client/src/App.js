import Map from './components/map/map';
import { createBrowserRouter,RouterProvider, } from "react-router-dom";
import ErrorPage from './components/errorScreen/errorScreen';
import LoginScreen from './components/loginScreen/loginScreen';
import RegisterScreen from './components/registerScreen/registerScreen';
import SearchResultScreen from './components/searchResultScreen/searchResultScreen';
import Settings from './components/settings/settings';
import TripDetailsScreen from './components/tripDetailsScreen/tripDetailsScreen';

// main app component, handles routing
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: <RegisterScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/map",
      element: <Map />,
    },
    {
      path: "/search",
      element: <SearchResultScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/details',
      element: <TripDetailsScreen />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/settings',
      element: <Settings />,
      errorElement: <ErrorPage />,
    },
    
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
