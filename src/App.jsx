import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Americano from './pages/Americano'
import './App.css'

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/americano" element={<Americano />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
