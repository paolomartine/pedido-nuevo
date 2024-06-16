import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const Sales = () => {
    const [ventasTotales, setVentasTotales] = useState(0);
    const [ventasPorProducto, setVentasPorProducto] = useState([]);

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const response = await axios.get('http://localhost:8085/api/v1/pedidos');
                const pedidos = response.data;
        
                // Ensure pedidos is defined and has the expected structure
                if (!pedidos || !Array.isArray(pedidos)) {
                    throw new Error('Invalid data structure received from API');
                }
        
                // Filtrar los pedidos que están pagados
                const pedidosPagados = pedidos.filter(pedido => pedido.estado === 'PAGADO');
        
                const totalVentas = pedidosPagados.reduce((sum, pedido) => sum + pedido.total, 0);
        
                // Agrupar ventas por producto
                const ventasProducto = pedidosPagados.flatMap(pedido => pedido.productos)
                    .reduce((acc, producto) => {
                        if (!acc[producto.nombre]) {
                            acc[producto.nombre] = 0;
                        }
                        acc[producto.nombre] += producto.precio * producto.cantidad;
                        return acc;
                    }, {});
        
                setVentasTotales(totalVentas);
                setVentasPorProducto(Object.entries(ventasProducto).map(([producto, total]) => ({ producto, total })));
        
            } catch (error) {
                console.error('Error fetching ventas:', error);
                // Handle the error appropriately, e.g., set error state or show an error message
            }
        };
        

        fetchVentas();
    }, []);

    return (
        <Box>
            <Typography variant="h4">Ventas Totales: ${ventasTotales.toFixed(2)}</Typography>
            <Typography variant="h5">Ventas por Producto</Typography>
            <List>
                {ventasPorProducto.map((venta, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={venta.producto} secondary={`Total: $${venta.total.toFixed(2)}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default Sales;
