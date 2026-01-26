import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { Layout } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'

const App = () => {
  return (
    <>
      <Routes>
        {/* Define your routes here */}
        <Route path='/' element={<Home />}/>

        <Route path='app' element={<Layout />}>
          {/* Adding 2 sub-routes */}
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />       
        </Route>

        <Route path='view/:resumeId' element={<Preview />}/>
        <Route path='login' element={<Login />}/>

      </Routes>

    </>
  )
}

export default App