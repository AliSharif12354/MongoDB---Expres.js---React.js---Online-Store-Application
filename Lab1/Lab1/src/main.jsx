import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import App from './App'
import Search from './assets/Routes/Search'
import Create from './assets/Routes/Create'

import './index.css'
import Product from './assets/Routes/Product'
import ProductReviews from './assets/Routes/ProductReviews'
import Orders from './assets/Routes/Orders'
import OrderSpecific from './assets/Routes/OrderSpecific'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/Search" element={<Search/>}/>
          <Route path="/Create" element={<Create/>}/>
          <Route path="/product/:id" element={<Product/>}/>
          <Route path="/product/:id/reviews" element={<ProductReviews/>}/>
          <Route path="/Orders" element={<Orders/>}/>
          <Route path="/Orders/:id" element={<OrderSpecific/>}/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
