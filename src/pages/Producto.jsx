import React, { useState, useEffect } from 'react';
import './Producto.css';
import DropdownNumerosMayoresACero from './DropdownNumerosMayoresACero';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const API_BASE_URL = 'http://localhost:8085';

function Producto() {
  const [data, setData] = useState([]);
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [detallePedido, setDetallePedido] = useState({ idProducto: null, cantidad: 0 });

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

  const handleAgregarPedido = async (idPedido, idProducto, cantidad) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/detallepedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_pedido: idPedido, id_producto: idProducto, cantidad: cantidad }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      // Aquí podrías realizar cualquier acción adicional si es necesario, como mostrar un mensaje de éxito.

      setDetallePedidos([...detallePedidos, { idPedido, idProducto, cantidad }]);
      setDetallePedido({ idPedido: null, idProducto: null, cantidad: 0 });
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleTerminarPedido = () => {
    // Aquí podrías realizar cualquier acción adicional antes de redirigir, como enviar los detalles del pedido a la página de menú.
    // Luego, rediriges a la página de menú.
    Navigate('/pedido');
  };
  const handleCancelarPedido = () => {
    // Aquí podrías realizar cualquier acción adicional antes de redirigir, como enviar los detalles del pedido a la página de menú.
    // Luego, rediriges a la página de menú.
    Navigate('/menu');
  };

  return (
    <div className="productos-container" style={{ backgroundColor: 'red', padding: '16px' }}>
      <div className="pedido-container">
        <h2>Pedido Actual</h2>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {detallePedidos.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.idProducto}</td>
                <td>{detalle.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul>
          {detallePedidos.map((detalle, index) => (
            <li key={index}>{`Producto ID: ${detalle.idProducto}, Cantidad: ${detalle.cantidad}`}</li>
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
              <DropdownNumerosMayoresACero numeros={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={(cantidad) => setDetallePedido({ ...detallePedido, cantidad })} />
              <button onClick={() => handleAgregarPedido(producto.id, detallePedido.cantidad)}>Agregar al pedido</button>
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
