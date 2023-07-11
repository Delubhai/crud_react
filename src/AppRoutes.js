import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />}>Home</Route>
      <Route path='/about' element={<About />}>About</Route>
      <Route path='/contact' element={<Contact />}>Contact Us</Route>
      <Route path='*' element={<NotFound />}></Route>
    </Routes>
  )
}

export default AppRoutes