import { Box, AppBar, Container, Toolbar, Typography, Link } from '@mui/material'
import React from 'react'
import mylogo from './logoempacadora.png';

const Header = ({ brand }) => {
  return (
    <Box>
      <Container> 
                  
              <img src={mylogo} alt="Logo de la empacadora" width="150" height="100"/>
            
              </Container>

    </Box>
  )
}

export default Header 