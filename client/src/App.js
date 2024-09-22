import './App.css';
import Map from './components/map/map';
import SearchResultScreen from './components/searchResultScreen/searchResultScreen';
import LoginScreen from './components/loginScreen/loginScreen';
import RegisterScreen from './components/registerScreen/registerScreen';
import TripDetailsScreen from './components/tripDetailsScreen/tripDetailsScreen';
import { createBrowserRouter,RouterProvider, } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginScreen />,
    },
    {
      path: "/register",
      element: <RegisterScreen />,
    },
    {
      path: "/map",
      element: <Map />,
    },
    {
      path: "/search",
      element: <SearchResultScreen />,
    },
    {
      path: '/details',
      element: <TripDetailsScreen />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
