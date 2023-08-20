import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import { useEffect, useState } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import LoginChecker from './components/LogInChecker'

function App() {

  const [user, setUser] = useState(false)

  useEffect(() => {
    async function checkUserStatus(){
      const response = await fetch('http://localhost:3001/api/user/status', {
        method: 'GET',
        credentials: "include"
      })

      const result = await response.json()
      if(result.status === 'success'){
        setUser(true)
      }
    }

    checkUserStatus()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <ProtectedRoute user={user}><Home /></ProtectedRoute> }>
          <Route path='/register' element={ <Register /> }/>
        </Route>
        <Route path='/login' element={ <Login user={user}/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App