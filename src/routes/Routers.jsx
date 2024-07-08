import React from 'react'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Table from '../pages/Table'
import User from '../pages/User'
import Edit from '../pages/Edit'

import DetallePedido from '../pages/DetallePedido';
import Detail from '../pages/Detail';

import DomicilioForm from '../pages/DomicilioForm';
import OrderForm from '../pages/OrderForm';
import PedidoForm from '../pages/PedidoForm'
import Despachados from '../pages/Despachados';
import Ventas from '../pages/Ventas';
import OrderFormDom from '../pages/OrderFormDom';
import DetallePedidoDom from '../pages/DetallePedidoDom';
import DomiciliosDespachados from '../pages/DomiciliosDespachados';


import PedidosTable from '../pages/PedidosTable';
import Prueba4 from '../pages/Prueba4';


const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />   
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />      
    <Route path="/mesas" element={<Table />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<User />} />
     <Route path="/pedidos" element={<Prueba4 />} />   
     {/* <Route path="/pedidos" element={<DetallePedido />} />       */}
    <Route path="/domicilios" element={<DomicilioForm />} /> 
    <Route path="/detallepedido" element={<OrderForm />} />
    <Route path="/detallepedidodom" element={<OrderFormDom />} />
    <Route path="/pedido" element={<PedidoForm />} />
    <Route path="/despachados" element={<Despachados />} />
    <Route path="/ventas" element={<Ventas />} />
    <Route path="/domicili" element={<DetallePedidoDom />} />
    <Route path="/envios" element={<DomiciliosDespachados />} />
    
  </Routes>

}

export default Routers