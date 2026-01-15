import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Authentication } from './Components/Questions1'
import { FileUpload } from './Components/Question2'
import { Todo } from './Components/Question3'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Authentication/>
      <FileUpload/>
      <Todo/>
    </>
  )
}

export default App
