import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import About from './About'

export default function Frontend() {
  return (
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='about' element={<About />}/>
    </Routes>
  )
}
