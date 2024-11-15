import { Box, AppBar, Container, Toolbar, Typography, } from '@mui/material'
import React from 'react'
import mylogo from './logoempacadora.png';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";


const Header = ({ brand }) => {
  return (
    <Box>
      <Container>

        <img src={mylogo} alt="Logo de la empacadora" width="150" height="100" />
        <Button component={Link} to="/PedidoNuevo" variant="contained" style={{ marginBottom: '16px' }}>
          Pedido Nuevo
        </Button>
        <Button component={Link} to="/mesas" variant="contained" style={{ marginBottom: '16px' }}>
          Mesas
        </Button>

        <Button component={Link} to="/editar" variant="contained" style={{ marginBottom: '16px' }}>
          Productos
        </Button>
        <Button component={Link} to="/Clientes" variant="contained" style={{ marginBottom: '16px' }}>
          Clientes
        </Button>
        <Button component={Link} to="/menu" variant="contained" style={{ marginBottom: '16px' }}>
          Menú
        </Button>
        <Button component={Link} to="/pedidos" variant="contained" style={{ marginBottom: '16px' }}>
          Pedidos
        </Button>
        <Button component={Link} to="/despachados" variant="contained" style={{ marginBottom: '16px' }}>
          Despachados
        </Button>
        <Button component={Link} to="/ventas" variant="contained" style={{ marginBottom: '16px' }}>
          Ventas
        </Button>
        <Button component={Link} to="/domicili" variant="contained" style={{ marginBottom: '16px' }}>
          Domicilios
        </Button>
        <Button component={Link} to="/envios" variant="contained" style={{ marginBottom: '16px' }}>
          Envios
        </Button>
      </Container>

    </Box>
  )
}

export default Header 