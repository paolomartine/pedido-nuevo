import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const DetallePedido = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get("http://localhost:8085/api/v1/pedidos");
        setPedidos(response.data);
        setLoadingPedidos(false);
      } catch (error) {
        setErrorPedidos(error);
        setLoadingPedidos(false);
      }
    };
    fetchPedidos();
  }, []);

  if (loadingPedidos) {
    return <div>Cargando pedidos...</div>;
  }

  if (errorPedidos) {
    return <div>Error cargando pedidos: {errorPedidos.message}</div>;
  }

  return (
    <div>
      <h6>Pedidos</h6>
      <Table striped bordered hover>
  <thead>
    <tr>
      <th style={{ width: '10%' }}>ID</th>
      <th style={{ width: '40%' }}>Pedidos</th>
      <th style={{ width: '20%' }}>Destino</th>
      <th style={{ width: '30%' }}>Total</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.map((pedido) => (
      <tr key={pedido.id}>
        <td>{pedido.id}</td>
        <td>
          {pedido.pedidos && Array.isArray(pedido.pedidos) && pedido.pedidos.length > 0 ? (
            pedido.pedidos.map((pedidoDetalle, index) => (
              <p key={index}>
                {pedidoDetalle.producto} (Cantidad: {pedidoDetalle.cantidad})
              </p>
            ))
          ) : (
            <p>No hay pedidos registrados para este pedido.</p>
          )}
        </td>
        <td>
          {pedido.id_mesa && pedido.id_mesa.id ? `Mesa ${pedido.id_mesa.id}` : 'Información de mesa no disponible'}
        </td>
        <td>{pedido.total}</td>
      </tr>
    ))}
  </tbody>
</Table>


    </div>
  );
};

export default DetallePedido;
