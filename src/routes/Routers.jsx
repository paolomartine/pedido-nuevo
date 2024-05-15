import React from 'react'
import Mesas from '../pages/Mesas'
import PedidoNuevo from '../pages/PedidoNuevo'
import Menu from '../pages/Menu'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Producto from '../pages/Producto'
import MesaForm from '../pages/MesaForm'

import ClienteForm from '../pages/ClienteForm'
import Clientes from '../pages/Clientes'
import Edit from '../pages/Edit'





const Routers = () => {
  return <Routes>
    <Route path="/" element={<Menu />} />
    <Route path="/mesas" element={<Mesas />} />
    <Route path="/pedidonuevo" element={<PedidoNuevo />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/productos" element={<Producto />} />

    <Route path="/mesaform" element={<MesaForm />} />
    <Route path="/clienteform" element={<ClienteForm />} />
    <Route path="/editar" element={<Edit />} />
    <Route path="/clientes" element={<Clientes />} />
  </Routes>

}

export default Routers