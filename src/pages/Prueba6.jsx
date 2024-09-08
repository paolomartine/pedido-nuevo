import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

const Prueba6 = () => {
    const [detallesPedidos, setDetallesPedidos] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchDetallesPedidos();
    }, []);

    const fetchDetallesPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/detallepedidos?estadoDetalle=0');
            const detallesConTotales = response.data.map(detalle => ({
                ...detalle,
                total: detalle.cantidad * detalle.id_producto.precio  // Agregar el campo total calculado
            }));
            setDetallesPedidos(detallesConTotales);
        } catch (error) {
            console.error('Error fetching detallesPedidos:', error);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const despacharPedido = async () => {
        if (selectedRows.length === 0) {
            alert('Selecciona al menos una fila para despachar.');
            return;
        }

        try {
            setUpdating(true);
            await Promise.all(
                selectedRows.map(async (rowId) => {
                    const detallePedido = detallesPedidos.find(detalle => detalle.id === rowId);
                    if (detallePedido) {
                        const updatedDetalle = { ...detallePedido, estadoDetalle: 1 };
                        await axios.put(`http://localhost:8085/api/v1/detallepedidos/${rowId}`, updatedDetalle);
                    }
                })
            );
            alert('Actualización exitosa.');
            setSelectedRows([]);
            fetchDetallesPedidos(); // Actualiza la lista después de la operación
        } catch (error) {
            console.error('Error updating detallesPedidos:', error);
        } finally {
            setUpdating(false);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'id_pedido.id_cliente.nombre', headerName: 'Cliente', width: 200 },
        { field: 'id_pedido.id_mesa.id', headerName: 'Mesa', width: 150 },
        { field: 'id_detalle.id_producto.nombre', headerName: 'Producto', width: 200 },
        { field: 'cantidad', headerName: 'Cantidad', width: 150 },
        { field: 'observacion', headerName: 'Observación', width: 200 },
        { field: 'estadoDetalle', headerName: 'Estado', width: 150 },
        { field: 'total', headerName: 'Total', width: 150 },  // Agregar columna de total
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={detallesPedidos}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={handleSelectionChange}
            />
            <div>
                <button onClick={despacharPedido} disabled={selectedRows.length === 0 || updating}>
                    Despachar Pedido
                </button>
            </div>
        </div>
    );
};

export default Prueba6;
