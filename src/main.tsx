import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import theme from "./theme";
import ErrorPage from "./components/pages/ErrorPage";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import DatabaseInfo from "./components/pages/DatabaseInfo";
import { IpfsProvider } from "./context/IpfsProvider";
import { OrbitDBProvider } from "./context/OrbitDBProvier";
import Libp2pStatus from "./components/pages/Libp2pStatus";
import { IdentitiesProvider } from "./context/IdentitiesProvider";
import IdentityInfo from "./components/pages/IdentityInfo";
import DatabaseDetail from "./components/pages/DatabaseDetail";
import ConnectDatabse from "./components/pages/ConnectDatabse";
import { CookiesProvider } from "react-cookie";
import Layout from "./components/pages/_Layout";
import Libp2pConfig from "./components/pages/Libp2pConfig";
import CreateDatabase from "./components/pages/CreateDatabase";
import { ErrorProvider } from "./context/ErrorProvider";
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Layout />
      </ChakraProvider>
    ),
    children: [
      {
        path: "/add-database",
        element: <CreateDatabase />,
      },
      {
        path: "/connect-database",
        element: <ConnectDatabse />,
      },
      {
        path: "/libp2p-config",
        element: <Libp2pConfig />,
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
        path: "/database-info/orbitdb/:address/detail",
        element: <DatabaseDetail />,
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
    <ErrorProvider>
      <CookiesProvider>
        <IpfsProvider>
          <IdentitiesProvider>
            <OrbitDBProvider>
              <RouterProvider router={router} />
            </OrbitDBProvider>
          </IdentitiesProvider>
        </IpfsProvider>
      </CookiesProvider>
    </ErrorProvider>
  </React.StrictMode>
);
