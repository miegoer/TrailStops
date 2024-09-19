import './App.css';
import Map from './components/map/map';
import SearchResultScreen from './components/searchResultScreen/searchResultScreen';
import { createBrowserRouter,RouterProvider, } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Map />,
    },
    {
      path: "/search",
      element: <SearchResultScreen />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
