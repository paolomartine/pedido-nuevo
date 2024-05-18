import React from 'react'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Producto from '../pages/Producto'
import Table from '../pages/Table'
import User from '../pages/User'
import Edit from '../pages/Edit'

const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />   
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/productos" element={<Producto />} />    
    <Route path="/mesas" element={<Table />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<User />} />
  </Routes>

}

export default Routers