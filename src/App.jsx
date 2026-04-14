import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ServiceList from './pages/services/ServiceList'
import ServiceForm from './pages/services/ServiceForm'
import TestimonialList from './pages/testimonials/TestimonialList'
import TestimonialForm from './pages/testimonials/TestimonialForm'
import Login from './pages/Login'
import NewsletterList from './pages/newsletter/NewsletterList'
import CallbackList from './pages/callbacks/CallbackList'
import CallbackForm from './pages/callbacks/CallbackForm'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import GlobalLoader from './components/common/GlobalLoader'
import ResultImageList from './pages/resultImages/ResultImageList'
import ResultImageForm from './pages/resultImages/ResultImageForm'

const ThemeWatcher = () => {
  const theme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
  }, [theme])

  return null
}

function App() {
  return (
    <>
      <ThemeWatcher />
      <GlobalLoader />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover={false} />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/new" element={<ServiceForm />} />
          <Route path="/services/:id" element={<ServiceForm />} />
          <Route path="/result-images" element={<ResultImageList />} />
          <Route path="/result-images/new" element={<ResultImageForm />} />
          <Route path="/result-images/:id" element={<ResultImageForm />} />
          <Route path="/testimonials" element={<TestimonialList />} />
          <Route path="/testimonials/new" element={<TestimonialForm />} />
          <Route path="/testimonials/:id" element={<TestimonialForm />} />
          <Route path="/requestcallbacks" element={<CallbackList />} />
          <Route path="/requestcallbacks/new" element={<CallbackForm />} />
          <Route path="/newsletter" element={<NewsletterList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
