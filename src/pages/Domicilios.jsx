import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

const Domicilios = () => {
  const [clientes, setClientes] = useState([]); // Estado para almacenar la lista de clientes
  const [idCliente, setIdCliente] = useState('');
  const [idPedido, setIdPedido] = useState('');

  useEffect(() => {
    // Obtiene la lista de clientes cuando el componente se monta
    obtenerClientes();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez al montar el componente

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el envío del formulario
    console.log('idCliente:', idCliente, 'idPedido:', idPedido);
  };

  const obtenerClientes = async () => {
    try {
      // Realiza una solicitud HTTP para obtener la lista de clientes
      const response = await axios.get('http://localhost:8085/api/v1/clientes');
      // Establece la lista de clientes en el estado
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-header">
          Domicilios
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="idCliente" className="form-label">ID Cliente</label>
              <select
                className="form-select"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                required
              >
                <option value="">Seleccionar cliente</option>
                {/* Mapea la lista de clientes para generar opciones en el select */}
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {/* Ajusta esto según la estructura de tu objeto cliente */}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="idPedido" className="form-label">ID Pedido</label>
              <input
                type="text"
                className="form-control"
                id="idPedido"
                value={idPedido}
                onChange={(e) => setIdPedido(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Domicilios;
