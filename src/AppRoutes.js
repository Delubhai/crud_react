import React from 'react'
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import ResponsiveAppBar from './components/Appbar'
import Login from './authPages/Login'

const isAuthenticated = () => {
  let localData = localStorage.getItem('vAccessToken')
  if (localData) {
    return true;
  } else {
    return false;
  }
};
const PrivateRoute = ({ path, element }) => {
  return isAuthenticated() ? (
    <>
      <ResponsiveAppBar />
      {element}
    </>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/about" element={<PrivateRoute element={<About />} />} />
        <Route path="/contact" element={<PrivateRoute element={<Contact />} />} />
        <Route path="*" element={<PrivateRoute element={<NotFound />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes