import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLimit from "./pages/user-options/user-limit/UserLimit";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Users from "./pages/user-options/users/Users";
import UserInfo from "./pages/user-options/user-info/UserInfo";
import ColorsPage from "./pages/colors/ColorsPage";
import MaterialsPage from "./pages/materials/MaterialsPage";
import HighAbrasion from "./pages/high-abrasion/HighAbrasion";
import NewLibrary from "./pages/new-library/NewLibrary";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthBootstrap from "./routes/AuthBootstrap";
import MaterialDetail from "./pages/materials/tabs/material/MaterialDetail";
import HighAbrasionDetail from "./pages/high-abrasion/HighAbrasionDetail";
import NewLibraryDetail from "./pages/new-library/NewLibraryDetail";
import LastLibrary from "./pages/last-library/LastLibrary";
import LastLibraryDetail from "./pages/last-library/LastLibraryDetail";

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} handle={{ hideTitle: true }} />
            <Route path="/user-limit" element={<UserLimit />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/colors" element={<ColorsPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route
              path="/materials/show-info/:id"
              element={<MaterialDetail />}
            />
            <Route path="/high-abrasion" element={<HighAbrasion />} />
            <Route
              path="/high-abrasion/show-info/:id"
              element={<HighAbrasionDetail />}
            />
            <Route path="/new-library" element={<NewLibrary />} />
            <Route
              path="/new-library/show-info/:id"
              element={<NewLibraryDetail />}
            />
            <Route path="/last-library" element={<LastLibrary />} />
            <Route
              path="/last-library/show-info/:id"
              element={<LastLibraryDetail />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthBootstrap>
  );
}
