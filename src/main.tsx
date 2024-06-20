import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import theme from "./theme";
import ErrorPage from "./components/pages/ErrorPage";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Home from "./components/pages/Home";
import AddDatabase from "./components/pages/AddDatabase";
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
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
