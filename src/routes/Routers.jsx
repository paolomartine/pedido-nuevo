import React from 'react'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Producto from '../pages/Producto'
import Table from '../pages/Table'
import User from '../pages/User'
import Edit from '../pages/Edit'
import PedidoMesa from '../pages/PedidoMesa';
import PedidoForm from '../pages/PedidoForm';
import DetallePedido from '../pages/DetallePedido';
import Pedido from '../pages/Pedido';

const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />   
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/productos" element={<Producto />} />    
    <Route path="/mesas" element={<Table />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<User />} />
    <Route path="/pedidos" element={<Pedido />} />
    <Route path="/detalle" element={<DetallePedido />} />
  </Routes>

}

export default Routers