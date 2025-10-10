import HomePage from "./pages/HomePage"
import ErrorPage from "./pages/ErrorPage"
import RedirectPage from "./pages/RedirectPage"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from "react"
import { AnimatePresence } from 'framer-motion'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/redirect/:id" element={<RedirectPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App
