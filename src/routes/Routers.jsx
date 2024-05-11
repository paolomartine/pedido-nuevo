import React from 'react'
import Mesas from '../pages/Mesas'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import {Routes, Route}from 'react-router-dom'
import Producto from '../pages/Producto'
import MesaForm from '../pages/MesaForm'
import ProductoForm from '../pages/ProductoForm'
import ClienteForm from '../pages/ClienteForm'

const Routers = () => {
  return <Routes>
    <Route path="/"element={<Menu/>}/>
    <Route path="/mesas"element={<Mesas/>}/>
    <Route path="/pedidonuevo"element={<PedidoNuevo/>}/>    
    <Route path="/menu"element={<Menu/>}/>
    <Route path="/productos"element={<Producto/>}/>    
    <Route path="/productoform"element={<ProductoForm/>}/>
    <Route path="/mesaform"element={<MesaForm/>}/>
    <Route path="/clienteform"element={<ClienteForm/>}/>
  </Routes>
  
}

export default Routers