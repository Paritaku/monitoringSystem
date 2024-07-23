import { Route, Routes } from 'react-router-dom'
import './App.css'
import MyLayout from './Components/Layout/MyLayout'
import LoginForm from './Components/LoginForm/LoginForm'


function App() {
  return (
    <>
    {/*
      <Routes>
        <Route path='/' element={<LoginForm />}/>
      </Routes>*/}
      <MyLayout />
    </>
  )
}

export default App
