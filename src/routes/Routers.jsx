import React from 'react'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Table from '../pages/Table'
import User from '../pages/User'
import Edit from '../pages/Edit'

import DetallePedido from '../pages/DetallePedido';

import DomicilioForm from '../pages/DomicilioForm';
import OrderForm from '../pages/OrderForm';
import PedidoForm from '../pages/PedidoForm'
import Despachados from '../pages/Despachados';
import Ventas from '../pages/Ventas';




const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />   
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />      
    <Route path="/mesas" element={<Table />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<User />} />
    <Route path="/pedidos" element={<DetallePedido />} />     
    <Route path="/domicilios" element={<DomicilioForm />} /> 
    <Route path="/detallepedido" element={<OrderForm />} />
    <Route path="/pedido" element={<PedidoForm />} />
    <Route path="/despachados" element={<Despachados />} />
    <Route path="/ventas" element={<Ventas />} />
    
  </Routes>

}

export default Routers