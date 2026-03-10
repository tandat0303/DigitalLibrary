import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserLimit from "./pages/user-options/user-limit/UserLimit";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Users from "./pages/user-options/users/Users";
import UserInfo from "./pages/user-options/user-info/UserInfo";
import ColorsPage from "./pages/colors/ColorsPage";
import MaterialsPage from "./pages/materials/MaterialsPage";
import MaterialDetailPage from "./pages/materials/tabs/material/MaterialDetail";
import HighAbrasion from "./pages/high-abrasion/HighAbrasion";
import NewLibrary from "./pages/new-library/NewLibrary";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthBootstrap from "./routes/AuthBootstrap";

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
            <Route path="/show-info/:id" element={<MaterialDetailPage />} />
            <Route path="/high-abrasion" element={<HighAbrasion />} />
            <Route path="/new-library" element={<NewLibrary />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthBootstrap>
  );
}
