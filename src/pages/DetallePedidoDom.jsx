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
        field: 'domicilios',
        headerName: 'Domicilios',
        width: 300,
        renderCell: (params) => (
            <div>
                {params.row.domicilios.map((domicilio, index) => (
                    <span key={index}>
                        <Typography noWrap>
                            {domicilio.producto} ({domicilio.cantidad}) {domicilio.observacion}
                        </Typography>
                    </span>
                ))}
            </div>
        ),
    },
    { field: 'destino', headerName: 'Destino', width: 210 },
    { field: 'estado', headerName: 'Estado', width: 210 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
    {
        field: 'acciones', headerName: 'Acciones', width: 150,
        renderCell: (params) => (
            <div>
                <span>
                    <Button
                        onClick={() => {
                            window.location.href = `/detallepedidodom`;
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

const DetallePedidoDom = () => {
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedDomicilio, setSelectedDomicilio] = useState([]);
    const [checkedProductos, setCheckedProductos] = useState([]);
    const [domicilios, setDomicilios] = useState([]);

    const [rows, setRows] = useState([]);
    const [loadingDomicilios, setLoadingDomicilios] = useState(true);

    const [loadingProductos, setLoadingProductos] = useState(false);

    const [errorDomicilios, setErrorDomicilios] = useState(null);
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
        const fetchDomicilios = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/domicilios");
                const filteredDomicilios = response.data.filter(domicilio => domicilio.estado === "PEDIDO");
                setDomicilios(filteredDomicilios);
                setLoadingDomicilios(false);
            } catch (error) {
                setErrorDomicilios(error);
                setLoadingDomicilios(false);
            }
        };
        fetchDomicilios();
    }, []);

    const fetchProductos = async (domicilioId) => {
        try {
            const response = await axios.get(
                `http://localhost:8085/api/v1/detallepedidosdom/${domicilioId}/productos`);
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
                domicilios.map(async (domicilio) => {
                    const productosData = await fetchProductos(domicilio.id);
                    const domiciliosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                    }));
                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    return {
                        id: domicilio.id,
                        domicilios: domiciliosFormat,
                        destino: domicilio.id_cliente.direccion,
                        estado: domicilio.estado,
                        total: total,
                    };
                })
            );
            setRows(rows);
            setLoadingProductos(false);
        };

        if (domicilios.length > 0) {
            generateRows();
        }
    }, [domicilios]);

    const handleDespachar = async () => {
        if (selectedRowsData.length > 0) {
            const productos = await fetchProductos(selectedRowsData[0].id);
            setSelectedDomicilio(productos);
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

    const handleModalDespachar = async () => {
        const domicilioId = selectedRowsData[0].id;
        try {
            // Obtener los datos del domicilio actual
            const response = await axios.get(`http://localhost:8085/api/v1/domicilios/${domicilioId}`);
            const domicilioData = response.data.data;

            // Actualizar el estado del domicilio a "DESPACHADO"
            const updatedDomicilio = {
                ...domicilioData,
                estado: 'DESPACHADO',
            };
            await axios.put(`http://localhost:8085/api/v1/domicilios`, updatedDomicilio);

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

    if (loadingDomicilios) return <div>Cargando domicilios...</div>;
    if (errorDomicilios) return <div>Error cargando domicilios: {errorDomicilios.message}</div>;
    if (loadingProductos) return <div>Cargando productos...</div>;
    if (errorProductos) return <div>Error cargando productos: {errorProductos.message}</div>;

    return (
        <div style={{ height: 400, width: '80%', marginLeft: '10%', marginTop: '2%', marginBottom: '10%' }}>
            <Typography variant="h6" gutterBottom>
                Domicilios
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
                        Despachar
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
                        Detalles del Domicilio
                    </Typography>
                    <List>
                        {selectedDomicilio && selectedDomicilio.map((producto, index) => (
                            <ListItem key={index} onClick={handleToggle(producto)}>
                                <Checkbox
                                    edge="start"
                                    checked={checkedProductos.indexOf(producto) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText
                                    primary={`Producto: ${producto.nombre} (Cantidad: ${producto.cantidad}) (Observación: ${producto.observacion})`}
                                    secondary={`Total: $${(producto.precio * producto.cantidad).toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleModalDespachar}
                        disabled={checkedProductos.length !== selectedDomicilio.length}
                    >
                        Despachar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default DetallePedidoDom;