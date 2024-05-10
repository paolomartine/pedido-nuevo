import React from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';


const PedidoNuevo = () => {
  return (
    <div style={{ backgroundColor: 'red', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <div>Pedido Nuevo</div>
        <Container>
          
          <Stack spacing={2} direction="row">
            <Button variant="contained" component={Link} to="/mesas">Mesas</Button>
            <Button variant="contained">Domicilio</Button>
          </Stack>
          <Alert severity="info">Selecciona si tu pedido es para mesa o domicilio.</Alert>
        </Container>
      </div>
    </div>
  );
};

export default PedidoNuevo;
