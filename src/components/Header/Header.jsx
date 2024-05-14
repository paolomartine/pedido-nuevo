import { Box, AppBar, Container, Toolbar, Typography, } from '@mui/material'
import React from 'react'
import mylogo from './logoempacadora.png';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';


const Header = ({ brand }) => {
  return (
    <Box>
      <Container>

        <img src={mylogo} alt="Logo de la empacadora" width="150" height="100" />
        <Button component={Link} to="/PedidoNuevo" variant="contained" style={{ marginBottom: '16px' }}>
          Pedido Nuevo
        </Button>
        <Button component={Link} to="/MesaForm" variant="contained" style={{ marginBottom: '16px' }}>
          Mesas
        </Button>

        <Button component={Link} to="/editar" variant="contained" style={{ marginBottom: '16px' }}>
         Productos
        </Button>
        <Button component={Link} to="/ClienteForm" variant="contained" style={{ marginBottom: '16px' }}>
          Clientes
        </Button>
        
      </Container>

    </Box>
  )
}

export default Header 