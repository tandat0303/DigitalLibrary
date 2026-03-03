import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../routes/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Users from "../pages/user-options/users/Users";
import UserLimit from "../pages/user-options/user-limit/UserLimit";
import UserInfo from "../pages/user-options/user-info/UserInfo";
import ColorsPage from "../pages/colors/ColorsPage";
import MaterialsPage from "../pages/materials/MaterialsPage";
import MaterialDetailPage from "../pages/materials/tabs/material/MaterialDetail";
import HighAbrasion from "../pages/high-abrasion/HighAbrasion";
import NewLibrary from "../pages/new-library/NewLibrary";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <Home />, handle: { hideTitle: true } },
          {
            path: "/users",
            element: <Users />,
            handle: { title: "User Mgmt" },
          },
          {
            path: "/user-limit",
            element: <UserLimit />,
            handle: { title: "User Limit Mgmt" },
          },
          {
            path: "/user-info",
            element: <UserInfo />,
            handle: { hideTitle: true },
          },
          {
            path: "/colors",
            element: <ColorsPage />,
            handle: { title: "Colors" },
          },
          {
            path: "/materials",
            element: <MaterialsPage />,
            handle: { title: "Materials" },
          },
          {
            path: "/show-info/:unique_price_id",
            element: <MaterialDetailPage />,
            handle: { hideTitle: true },
          },
          {
            path: "/high-abrasion",
            element: <HighAbrasion />,
            handle: { title: "High Abrasion" },
          },
          {
            path: "/new-library",
            element: <NewLibrary />,
            handle: { title: "New Library" },
          },
        ],
      },
    ],
  },
]);
