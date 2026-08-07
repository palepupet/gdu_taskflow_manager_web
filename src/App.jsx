import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/layouts/ProtectedRoute.jsx'
import ManagerRoute from "./components/layouts/ManagerRoute.jsx"
import DashboardLayout from './components/layouts/DashboardLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx"
import ProjectCreatePage from "./pages/ProjectCreatePage.jsx"
import ProjectEditPage from "./pages/ProjectEditPage.jsx"
import UsersPage from "./pages/UsersPage.jsx"

function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/create" element={<ProjectCreatePage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route element={<ManagerRoute />}>
                    <Route path="/users" element={<UsersPage />} />
                </Route>
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/projects" />} />
    </Routes>
  )
}

export default App
