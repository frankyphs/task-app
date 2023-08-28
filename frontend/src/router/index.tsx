import { createBrowserRouter } from "react-router-dom";
import React from "react";
import LandingPage from "../pages/LandingPage";
import Table from "../components/Table";
// import AddFormRevision from "../components/AddFormRevision";
// import Customize from "../components/Customize";
import CustomizeRevise from "../components/CustomizeRevise";
import Data from "../components/Data";

const router = createBrowserRouter([
  {
    path: "",
    element: <LandingPage />,
    children: [
      {
        path: "/",
        element: <Table />,
      },
      {
        path: "/add-task",
        element: <Data />,
      },
      {
        path: "/customize-form",
        element: <CustomizeRevise />,
      },
    ],
  },
]);

export default router;
