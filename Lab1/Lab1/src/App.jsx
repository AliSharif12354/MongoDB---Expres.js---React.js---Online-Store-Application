import { useState } from 'react'
import Feature from './Feature';
import './App.css'



function App() {
  const apiUrl = 'http://localhost:8000/';
  
  return (
    <div className="App">
      <h1>Sharif's Store</h1>
      <Feature name="Product Search" url="/Search"/>
      <Feature name="Create Product" url="/Create"/>
    </div>
  )
}

export default App
