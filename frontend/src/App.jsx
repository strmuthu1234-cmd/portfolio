import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { Spinner } from './components/States'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ApiDemo from './pages/ApiDemo'
import Contact from './pages/Contact'
import Login from './pages/Login'

// Admin code is only downloaded when an admin visits the dashboard.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <p className="font-mono text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <Link to="/" className="btn-primary mt-6">
        Back home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/api-demo" element={<ApiDemo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}
