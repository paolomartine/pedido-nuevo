import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DetallePedido = () => {
  const [idPedido, setIdPedido] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(null);

  const fetchProducto = async (id) => {
    try {
      const response = await axios.get(`API_URL/productos/${id}`);
      setProducto(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (idProducto.trim() !== '') {
      fetchProducto(idProducto);
    }
  }, [idProducto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (idPedido.trim() === '' || idProducto.trim() === '' || cantidad.trim() === '') {
      console.log('Por favor, complete todos los campos');
      return;
    }

    try {
      await axios.post('API_URL/pedidos', {
        id_pedido: idPedido,
        id_producto: idProducto,
        cantidad: cantidad,
      });
      setProductos([...productos, { id_producto: idProducto, cantidad: cantidad }]);
      setIdPedido('');
      setIdProducto('');
      setCantidad('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Detalles del pedido</h5>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Número de pedido:</label>
            <input
              type="text"
              className="form-control"
              value={idPedido}
              onChange={(e) => setIdPedido(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>ID del producto:</label>
            <input
              type="text"
              className="form-control"
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="text"
              className="form-control"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Agregar Producto
          </button>
        </form>
        <table className="table mt-3">
          <thead>
            <tr>
              <th scope="col">Número de Pedido</th>
              <th scope="col">ID del Producto</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Nombre del Producto</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td>{idPedido}</td>
                <td>{producto.id_producto}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.nombre || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetallePedido;
