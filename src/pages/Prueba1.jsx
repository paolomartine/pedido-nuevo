
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Stack, Box, Modal, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";



const columns = [
    { field: 'id', headerName: 'ID', width: 70, align: 'left' },
    {
        field: 'detalles',
        headerName: 'Detalles',
        width: 300,
        renderCell: (params) => (
            <div>
                {/* Renderizar pedidos */}
                {params.row.pedidos && params.row.pedidos.map((pedido, index) => (
                    <span key={`pedido-${index}`}>
                        <Typography noWrap>
                            {pedido.producto} ({pedido.cantidad})
                        </Typography>
                    </span>
                ))}
                {/* Renderizar domicilios */}
                {params.row.domicilios && params.row.domicilios.map((domicilio, index) => (
                    <span key={`domicilio-${index}`}>
                        <Typography noWrap>
                            {domicilio.producto} ({domicilio.cantidad})
                        </Typography>
                    </span>
                ))}
            </div>
        ),
    },
    { field: 'destino', headerName: 'Destino', width: 210 },
    { field: 'estado', headerName: 'Estado', width: 210 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
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

const Prueba1  = () => {
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedDomicilio, setSelectedDomicilio] = useState([]);
    const [checkedProductos, setCheckedProductos] = useState([]);
    const [domicilios, setDomicilios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingDomicilios, setLoadingDomicilios] = useState(true);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorDomicilios, setErrorDomicilios] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);
    const [open, setOpen] = useState(false);
    const [ventaTotal, setVentaTotal] = useState(0);
    const [ventasPorProducto, setVentasPorProducto] = useState({});


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
                const filteredDomicilios = response.data.filter(domicilio => domicilio.estado === "DESPACHADO");
                setDomicilios(filteredDomicilios);
                setLoadingDomicilios(false);
            } catch (error) {
                setErrorDomicilios(error);
                setLoadingDomicilios(false);
            }
        };
        fetchDomicilios();
    }, []);

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

    const fetchProductos = async (domicilioId, pedidoId) => {
        try {
            const [domiciliosResponse, pedidosResponse] = await axios.all([
                axios.get(`http://localhost:8085/api/v1/detallepedidosdom/${domicilioId}/productos`),
                axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`)
            ]);
            
            const productos = [
                ...domiciliosResponse.data,
                ...pedidosResponse.data
            ];
            
            return productos;
        } catch (error) {
            setErrorProductos(error);
            return [];
        }
    };
    

    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            
            const fetchAllData = async (domicilioId, pedidoId) => {
                const [domiciliosData, pedidosData] = await Promise.all([
                    fetchProductos(domicilioId, 'domicilios'),
                    fetchProductos(pedidoId, 'pedidos')
                ]);
    
                const combinedData = [...domiciliosData, ...pedidosData];
                return combinedData;
            };
    
            const rows = await Promise.all(
                domicilios.map(async (domicilio) => {
                    const productosData = await fetchAllData(domicilio.id, domicilio.pedidoId);
                    
                    const productosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                    }));
    
                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    
                    return {
                        id: domicilio.id,
                        productos: productosFormat,
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
    
    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            let ventaTotalTemp = 0;
            const ventasPorProductoTemp = {};
    
            const fetchAllData = async (Id, tipo) => {
                const url = tipo === 'pedidos'
                    ? `http://localhost:8085/api/v1/detallepedidos/${Id}/productos`
                    : `http://localhost:8085/api/v1/detallepedidosdom/${Id}/productos`;
    
                const response = await axios.get(url);
                return response.data;
            };
    
            const pedidosData = await Promise.all(
                pedidos.map(async (pedido) => {
                    const productosData = await fetchAllData(pedido.id, 'pedidos');
                    const pedidosFormat = productosData.map((producto) => ({
                        producto: producto.precio,
                        cantidad: producto.cantidad,
                    }));
    
                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    ventaTotalTemp += total;
    
                    productosData.forEach((producto) => {
                        if (ventasPorProductoTemp[producto.nombre]) {
                            ventasPorProductoTemp[producto.nombre] += producto.cantidad;
                        } else {
                            ventasPorProductoTemp[producto.nombre] = producto.cantidad;
                        }
                    });
    
                    return {
                        id: pedido.id,
                        pedidos: pedidosFormat,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                        estado: pedido.estado,
                        total: total,
                    };
                })
            );
    
            const domiciliosData = await Promise.all(
                domicilios.map(async (domicilio) => {
                    const productosData = await fetchAllData(domicilio.id, 'domicilios');
                    const domiciliosFormat = productosData.map((producto) => ({
                        producto: producto.precio,
                        cantidad: producto.cantidad,
                    }));
    
                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    ventaTotalTemp += total;
    
                    productosData.forEach((producto) => {
                        if (ventasPorProductoTemp[producto.nombre]) {
                            ventasPorProductoTemp[producto.nombre] += producto.cantidad;
                        } else {
                            ventasPorProductoTemp[producto.nombre] = producto.cantidad;
                        }
                    });
    
                    return {
                        id: domicilio.id,
                        pedidos: domiciliosFormat,
                        destino: domicilio.id_cliente.direccion,
                        estado: domicilio.estado,
                        total: total,
                    };
                })
            );
    
            setRows([...pedidosData, ...domiciliosData]);
            setVentaTotal(ventaTotalTemp);
            setVentasPorProducto(ventasPorProductoTemp);
            setLoadingProductos(false);
        };
    
        if (pedidos.length > 0 || domicilios.length > 0) {
            generateRows();
        }
    }, [pedidos, domicilios]);
    

    

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

            // Actualizar el estado del domicilio a "PAGADO"
            const updatedDomicilio = {
                ...domicilioData,
                estado: 'PAGADO',
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
                Ventas
            </Typography>
            <Typography variant="h6" gutterBottom>
                Total de ventas: {ventaTotal}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Ventas por Producto:
            </Typography>
            {Object.keys(ventasPorProducto).map((producto) => (
                <Typography key={producto} variant="body1" gutterBottom>
                    {producto}: {ventasPorProducto[producto]}
                </Typography>
            ))}
            
        </div>
    );
};



export default Prueba1;