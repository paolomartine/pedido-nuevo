import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Stack, Box, Modal, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
                            {pedido.producto} ({pedido.cantidad})
                        </Typography>
                    </span>
                ))}
            </div>
        ),
    },
    { field: 'destino', headerName: 'Destino', width: 210 },
    { field: 'estado', headerName: 'Estado', width: 210 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
    { field: 'acciones', headerName: 'Acciones', width: 150,
        renderCell: (params) => (
            <div>
            <span>
                <Button
                    onClick={() => {
                        window.location.href = `/detallepedido`;
                    }}
                >
                    Adicionar
                </Button>
            </span>
        </div>
        ),
     },

];

// Estilos para el modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Despachados = () => {
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState([]);
    const [checkedProductos, setCheckedProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCheckedProductos([]);
        localStorage.removeItem('selectedProductos');
    };

    const onRowsSelectionHandler = (ids) => {
        const selectedData = ids
            .map((id) => rows.find((row) => row.id === id))
            .filter((row) => row !== undefined);

        setIsAnyRowSelected(ids.length > 0);
        setSelectedRowsData(selectedData);
    };

    useEffect(() => {
        console.log(selectedRowsData);
    }, [selectedRowsData]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "DESPACHADO");
                setPedidos(filteredPedidos);
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
                        estado: pedido.estado,
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

    const handleDespachar = async () => {
        if (selectedRowsData.length > 0) {
            const productos = await fetchProductos(selectedRowsData[0].id);
            setSelectedPedido(productos);
            handleOpen();
        }
    };

    const handleToggle = (producto) => () => {
        const currentIndex = checkedProductos.indexOf(producto);
        const newChecked = [...checkedProductos];

        if (currentIndex === -1) {
            newChecked.push(producto);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedProductos(newChecked);
        localStorage.setItem('selectedProductos', JSON.stringify(newChecked));
    };

    const handleModalPagar = async () => {
        const pedidoId = selectedRowsData[0].id;
        try {
            // Obtener los datos del pedido actual
            const response = await axios.get(`http://localhost:8085/api/v1/pedidos/${pedidoId}`);
            const pedidoData = response.data.data;

            // Actualizar el estado del pedido a "PAGADO"
            const updatedPedido = {
                ...pedidoData,
                estado: 'PAGADO',
            };
            await axios.put(`http://localhost:8085/api/v1/pedidos`, updatedPedido);

            // Actualizar la disponibilidad de la mesa a true
            const updatedMesa = {
                ...pedidoData.id_mesa,
                disponibilidad: true,
            };
            await axios.put(`http://localhost:8085/api/v1/mesas`, updatedMesa);

            console.log("Productos PAGADOS:", checkedProductos);
            handleClose();


        } catch (error) {
            console.error("Error despachando productos:", error);
        }
    };

    useEffect(() => {
        const savedCheckedProductos = JSON.parse(localStorage.getItem('selectedProductos'));
        if (savedCheckedProductos) {
            setCheckedProductos(savedCheckedProductos);
        }
    }, [open]);

    if (loadingPedidos) return <div>Cargando pedidos...</div>;
    if (errorPedidos) return <div>Error cargando pedidos: {errorPedidos.message}</div>;
    if (loadingProductos) return <div>Cargando productos...</div>;
    if (errorProductos) return <div>Error cargando productos: {errorProductos.message}</div>;

    return (
        <div style={{ height: 400, width: '80%', marginLeft: '10%', marginTop: '2%', marginBottom: '10%' }}>
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
                onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                checkboxSelection
            />
            <div style={{ marginTop: '5%', textAlign: 'center', marginBottom: '5%' }}>
                <Stack direction="row" spacing={20}>
                    <Button variant="contained" disabled={!isAnyRowSelected} onClick={handleDespachar}>
                        Pagar
                    </Button>
                </Stack>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Detalles del Despacho
                    </Typography>
                    <List>
                        {selectedPedido && selectedPedido.map((producto, index) => (
                            <ListItem key={index} onClick={handleToggle(producto)}>
                                <Checkbox
                                    edge="start"
                                    checked={checkedProductos.indexOf(producto) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText
                                    primary={`Producto: ${producto.nombre} (Cantidad: ${producto.cantidad})`}
                                    secondary={`Total: $${(producto.precio * producto.cantidad)}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleModalPagar}
                        disabled={checkedProductos.length !== selectedPedido.length}
                    >
                        Pagar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default Despachados; 

