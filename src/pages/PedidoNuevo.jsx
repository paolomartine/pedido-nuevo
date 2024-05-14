import React from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

const PedidoNuevo = () => {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Pedido Nuevo</h2>
      <Container>
        <Button variant="contained" component={Link} to="/mesas" style={{ marginRight: '10px', marginBottom: '10px' }}>Mesas</Button>
        <Button variant="contained" style={{ marginBottom: '10px' }}>Domicilio</Button>
      </Container>
      <Alert severity="info" style={{ marginTop: '20px', width: '300px', textAlign: 'center' }}>Selecciona si tu pedido es para mesa o domicilio.</Alert>
    </div>
  );
};

export default PedidoNuevo;
