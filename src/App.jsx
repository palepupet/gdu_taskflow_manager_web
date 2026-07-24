import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/layouts/ProtectedRoute.jsx'
import DashboardLayout from './components/layouts/DashboardLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
        </Route>

        <Route path="*" element={<Navigate to="/projects" />} />
    </Routes>
  )
}

export default App
