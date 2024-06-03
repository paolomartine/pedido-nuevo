import React from 'react'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Table from '../pages/Table'
import User from '../pages/User'
import Edit from '../pages/Edit'

import DetallePedido from '../pages/DetallePedido';
import TablePedido from '../pages/TablePedido';
import DomicilioForm from '../pages/DomicilioForm';
import OrderForm from '../pages/OrderForm';
import PedidoForm from '../pages/PedidoForm'




const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />   
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />
      
    <Route path="/mesas" element={<Table />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<User />} />
    <Route path="/pedidos" element={<DetallePedido />} /> 
    <Route path="/mesapedidos" element={<TablePedido />} /> 
    <Route path="/domicilios" element={<DomicilioForm />} /> 
    <Route path="/detallepedido" element={<OrderForm />} />
    <Route path="/pedido" element={<PedidoForm />} />

    
  </Routes>

}

export default Routers