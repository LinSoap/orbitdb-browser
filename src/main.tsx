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
import Libp2pStatus from "./components/pages/Libp2pStatus";
import { IdentitiesProvider } from "./context/IdentitiesProvider";
import IdentityInfo from "./components/pages/IdentityInfo";
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
        path: "/libp2p-status",
        element: <Libp2pStatus />,
      },
      {
        path: "/database-info/orbitdb/:address",
        element: <DatabaseInfo />,
      },
      {
        path: "/identity",
        element: <IdentityInfo />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IpfsProvider>
      <IdentitiesProvider>
        <OrbitDBProvider>
          <RouterProvider router={router} />
        </OrbitDBProvider>
      </IdentitiesProvider>
    </IpfsProvider>
  </React.StrictMode>
);
