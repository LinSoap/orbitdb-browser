import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import theme from "./theme";
import ErrorPage from "./components/pages/ErrorPage";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Home from "./components/pages/Home";
import AddDatabase from "./components/pages/AddDatabase";
import DatabaseInfo from "./components/pages/DatabaseInfo";
import { IpfsProvider } from "./context/IpfsProvider";
import { OrbitDBProvider } from "./context/OrbitDBProvier";
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Home />
      </ChakraProvider>
    ),
    children: [
      {
        path: "/add-database",
        element: <AddDatabase />,
      },
      {
        path: "/database-info/orbitdb/:address",
        element: <DatabaseInfo />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IpfsProvider>
      <OrbitDBProvider>
        <RouterProvider router={router} />
      </OrbitDBProvider>
    </IpfsProvider>
  </React.StrictMode>
);
