import React, { useState, useEffect } from 'react';
import './Producto.css';
import DropdownNumerosMayoresACero from './DropdownNumerosMayoresACero';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const API_BASE_URL = 'http://localhost:8085';

function Producto() {
  const [data, setData] = useState([]);
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/productos`);
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleAgregarPedido = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/detallepedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_producto: selectedProductId, cantidad: cantidad }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      const selectedProduct = data.find(producto => producto.id === selectedProductId);
      const nuevoDetallePedido = { idProducto: selectedProductId, nombreProducto: selectedProduct.nombre, cantidad: cantidad };
      setDetallePedidos([...detallePedidos, nuevoDetallePedido]);
      
      // Limpiar selección después de agregar pedido
      setSelectedProductId(null);
      setCantidad(0);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleTerminarPedido = () => {
    navigate('/menu');
  };

  const handleCancelarPedido = () => {
    navigate('/menu');
  };

  return (
    <div className="productos-container" style={{ backgroundColor: 'red', padding: '16px' }}>
      <div className="pedido-container">
        <h2>Pedido Actual</h2>

        <ul>
          {detallePedidos.map((detalle, index) => (
            <li key={index}>
              <strong>{detalle.nombreProducto}</strong>: {detalle.cantidad}
            </li>
          ))}
        </ul>

        <Button onClick={handleTerminarPedido} variant="contained" style={{ marginBottom: '16px' }}>Terminar Pedido</Button>
        <Button onClick={handleCancelarPedido} variant="contained" style={{ marginBottom: '16px' }}>Cancelar Pedido</Button>
      </div>
      {data.length > 0 ? (
        data.map((producto) => (
          <div key={producto.id} className="producto-card" style={{ border: '2px solid black', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div className="producto-image">
              <img src={producto.url} alt={producto.nombre} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="producto-details">
              <p className="producto-nombre" style={{ fontWeight: 'bold' }}>Nombre: {producto.nombre}</p>
              <p>Tiempo de preparación: {producto.tiempoPreparacion}</p>
              <p>Precio: {producto.precio}</p>
              <p>Ingredientes: {producto.ingredientes}</p>
              <DropdownNumerosMayoresACero numeros={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={(cantidad) => setCantidad(cantidad)} />
              <Button onClick={() => setSelectedProductId(producto.id)} variant="contained" style={{ marginTop: '8px' }}>Agregar al pedido</Button>
            </div>
          </div>
        ))
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default Producto;
