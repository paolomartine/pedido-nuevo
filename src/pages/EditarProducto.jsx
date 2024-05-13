import React, { useState } from 'react';
import ProductoForm from './ProductoForm';
import { Typography, Container, TextField, Button } from '@mui/material';
import UpdateProductoForm from './UpdateProductoForm';

function EditarProducto() {
  const [productoId, setProductoId] = useState('');
  const [productoEncontrado, setProductoEncontrado] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscarProducto = async () => {
    if (!productoId) {
      setError('Debes ingresar un ID de producto');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8085/api/v1/productos/${productoId}`);
      if (!response.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await response.json();
      setProductoEncontrado(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setProductoEncontrado(null);
    }
  };

  const handleChange = (e) => {
    setProductoId(e.target.value);
  };

  return (
    <Container maxWidth="md" className="flex justify-center items-center h-screen bg-blue-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <Typography variant="h4" align="center" gutterBottom>
          Editar Producto
        </Typography>
        <div className="mb-4">
          <TextField
            type="text"
            label="ID del producto"
            variant="outlined"
            value={productoId}
            onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuscarProducto}
            disabled={!productoId}
            className="mt-2"
          >
            Buscar
          </Button>
        </div>
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        {productoEncontrado && <UpdateProductoForm producto={productoEncontrado} />}
      </div>
    </Container>
  );
}

export default EditarProducto;
