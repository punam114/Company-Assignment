import { useState } from 'react'
import { BrowserRouter, Routes , Route , Navigate } from 'react-router-dom'
import './App.css'
import Artifacts from './pages/Artifacts'
import Creatures from './pages/Creatures'
import Logs from './pages/Logs'
import { Atom, Flame, Info,Snowflake } from 'lucide-react'
import Navbar from './Navbar'

function App() {
  const [isFrozen , setIsFrozen] = useState(false);

  return (
    <>
     <BrowserRouter>
     <div style={ {padding:"20px"}}>
      <header style={{marginBottom : '20px'}}>
 <h1 style={{fontSize:'2rem' , color :'blue' ,display : 'flex' ,alignItems : 'center' , gap:'10px'}}>
  <Atom size={32}/> NebulaVault
 </h1>
<p>Real-Time multivere dashboard , Your focous , preserved</p>
      </header>

<div style={{backgroundColor : 'pink' , border: '1px dashed' , padding :'16px' , marginBottom : '20px' , borderRadius : '12px'}}>
 <div style={{display: 'flex' , alignItems:'center' , justifyContent: 'space-between'}}>
  <div style={{display : 'flex' , alignItems:'center' , gap:'8px'}}>
    <strong>Temporal Freeze : </strong>
    <span style={{
      padding : '2px 8px',
      borderRadius : '4px',
      fontSize : '12px',
      backgroundClip : isFrozen ? 'red': 'green'
    }}>
      {isFrozen ? "PAUSED": "LIVE"}
    </span>
  </div>

  <button
  onClick={()=>setIsFrozen(!isFrozen)}
  style={{display : 'flex',
    alignItems : 'center',
    gap: '8px',
    padding : '8px 16px',
    border : 'none',
    borderRadius : '6px',
    backgroundColor: isFrozen ? 'blue' : 'red',
    color : 'white',
    cursor : 'pointer',
  }}
  >
    {isFrozen ? <Snowflake size={16}/> : <Flame size={16}/>}
    {isFrozen ? "Unfreeze Time" : "Freeze Time"}
  </button>
 </div>
 <p style={{fontSize : '12px' , marginTop:'8px' , color:"green"}}>When Frozen , new item hidden until you unfreeze</p>
</div>
<Navbar/>

<main>
  <Routes>
    <Route path='/' element={<Navigate to="/artifacts"/>}/>
    <Route path='/artifacts' element={<Artifacts isFrozen={isFrozen}/>}/>
    <Route path='/creatures'  element={<Creatures/>}/>
    <Route path='logs'  element={<Logs/>}/>
    <Route/>
  </Routes>
</main>

     </div>
     </BrowserRouter>
    </>
  )
}

export default App
