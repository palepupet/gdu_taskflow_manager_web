import './App.css'
import LoginPage from "./pages/LoginPage.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/layouts/ProtectedRoute.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";

function App() {
  return (
    <Routes>
        <Route path='/login' element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
            <Route path='/projects' element={<ProjectsPage />} />
        </Route>

        <Route path='*' element={<Navigate to='/projects' />} />
    </Routes>
  )
}

export default App
