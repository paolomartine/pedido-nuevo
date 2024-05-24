import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

// Definir las columnas del DataGrid
const columns = [
    { field: 'id', headerName: 'ID', width: 70, align: 'left' },
    {
        field: 'pedidos',
        headerName: 'Pedidos',
        width: 300,
        renderCell: (params) => (
            <div>
                {params.row.pedidos.map((pedido, index) => (
                    <span key={index}>
                        <Typography noWrap>
                            {pedido.producto} (Cantidad: {pedido.cantidad})
                        </Typography>
                    </span>
                ))}
            </div>
        ),
    },
    { field: 'destino', headerName: 'Destino', width: 210 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
];

const DetallePedido = () => {
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);

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

    const fetchProductos = async (pedidoId) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);
            return response.data;
        } catch (error) {
            setErrorProductos(error);
            return [];
        }
    };

    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            const rows = await Promise.all(
                pedidos.map(async (pedido) => {
                    const productosData = await fetchProductos(pedido.id);
                    const pedidosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                    }));
                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    return {
                        id: pedido.id,
                        pedidos: pedidosFormat,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                        total: total,
                    };
                })
            );
            setRows(rows);
            setLoadingProductos(false);
        };

        if (pedidos.length > 0) {
            generateRows();
        }
    }, [pedidos]);

    if (loadingPedidos) return <div>Cargando pedidos...</div>;
    if (errorPedidos) return <div>Error cargando pedidos: {errorPedidos.message}</div>;
    if (loadingProductos) return <div>Cargando productos...</div>;
    if (errorProductos) return <div>Error cargando productos: {errorProductos.message}</div>;

    return (
        <div style={{ height: 400, width: '80%', marginLeft: '10%', marginTop: '5%',  marginBottom: '5%'}}>
            <Typography variant="h6" gutterBottom>
                Pedidos
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
};

export default DetallePedido;
