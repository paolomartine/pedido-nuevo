// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { DataGrid } from '@mui/x-data-grid';
// import { Typography, Box, Modal, ListItem, ListItemText } from '@mui/material';
// import Swal from 'sweetalert2';
// import { Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {List} from "@mui/material";

// const columns = [
//     { field: 'id', headerName: 'ID', width: 70, align: 'left' },
//     {
//         field: 'detalles',
//         headerName: 'Detalles',
//         width: 300,
//         renderCell: (params) => (
//             <div>
//                 {/* Renderizar pedidos */}
//                 {params.row.pedidos && params.row.pedidos.map((pedido, index) => (
//                     <span key={`pedido-${index}`}>
//                         <Typography noWrap>
//                             {pedido.producto} ({pedido.cantidad})
//                         </Typography>
//                     </span>
//                 ))}
//                 {/* Renderizar domicilios */}
//                 {params.row.domicilios && params.row.domicilios.map((domicilio, index) => (
//                     <span key={`domicilio-${index}`}>
//                         <Typography noWrap>
//                             {domicilio.producto} ({domicilio.cantidad})
//                         </Typography>
//                     </span>
//                 ))}
//             </div>
//         ),
//     },
//     { field: 'destino', headerName: 'Destino', width: 210 },
//     { field: 'estado', headerName: 'Estado', width: 210 },
//     { field: 'total', headerName: 'Total', type: 'number', width: 120 },
// ];

// const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

// const Prueba1 = () => {
//     const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
//     const [selectedRowsData, setSelectedRowsData] = useState([]);
//     const [domicilios, setDomicilios] = useState([]);
//     const [pedidos, setPedidos] = useState([]);
//     const [rows, setRows] = useState([]);
//     const [loadingDomicilios, setLoadingDomicilios] = useState(true);
//     const [loadingPedidos, setLoadingPedidos] = useState(true);
//     const [errorPedidos, setErrorPedidos] = useState(null);
//     const [errorDomicilios, setErrorDomicilios] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [ventaTotal, setVentaTotal] = useState(0);
//     const [ventasPorProducto, setVentasPorProducto] = useState({});

//     const handleOpen = () => setOpen(true);
//     const handleClose = () => {
//         setOpen(false);
//     };

//     const onRowsSelectionHandler = (ids) => {
//         const selectedData = ids
//             .map((id) => rows.find((row) => row.id === id))
//             .filter((row) => row !== undefined);

//         setIsAnyRowSelected(ids.length > 0);
//         setSelectedRowsData(selectedData);
//     };

//     useEffect(() => {
//         console.log(selectedRowsData);
//     }, [selectedRowsData]);

//     useEffect(() => {
//         const fetchDomicilios = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8085/api/v1/domicilios");
//                 const filteredDomicilios = response.data.filter(domicilio => domicilio.estado === "PAGADO");
//                 setDomicilios(filteredDomicilios);
//                 setLoadingDomicilios(false);
//             } catch (error) {
//                 setErrorDomicilios(error);
//                 setLoadingDomicilios(false);
//             }
//         };
//         fetchDomicilios();
//     }, []);

//     useEffect(() => {
//         const fetchPedidos = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8085/api/v1/pedidos");
//                 const filteredPedidos = response.data.filter(pedido => pedido.estado === "PAGADO");
//                 setPedidos(filteredPedidos);
//                 setLoadingPedidos(false);
//             } catch (error) {
//                 setErrorPedidos(error);
//                 setLoadingPedidos(false);
//             }
//         };
//         fetchPedidos();
//     }, []);

//     const fetchProductos = async (id, tipo) => {
//         try {
//             const url = tipo === 'domicilios'
//                 ? `http://localhost:8085/api/v1/detallepedidosdom/${id}/productos`
//                 : `http://localhost:8085/api/v1/detallepedidos/${id}/productos`;
//             const response = await axios.get(url);
//             return response.data;
//         } catch (error) {
//             return [];
//         }
//     };

//     useEffect(() => {
//         const generateRows = async () => {
//             let ventaTotalTemp = 0;
//             const ventasPorProductoTemp = {};

//             const fetchAllData = async (id, tipo) => {
//                 const productosData = await fetchProductos(id, tipo);
//                 return productosData;
//             };

//             const domiciliosData = await Promise.all(
//                 domicilios.map(async (domicilio) => {
//                     const productosData = await fetchAllData(domicilio.id, 'domicilios');

//                     const productosFormat = productosData.map((producto) => ({
//                         producto: producto.nombre,
//                         cantidad: producto.cantidad,
//                     }));

//                     const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
//                     ventaTotalTemp += total;

//                     productosData.forEach((producto) => {
//                         if (ventasPorProductoTemp[producto.nombre]) {
//                             ventasPorProductoTemp[producto.nombre] += producto.cantidad;
//                         } else {
//                             ventasPorProductoTemp[producto.nombre] = producto.cantidad;
//                         }
//                     });

//                     return {
//                         id: domicilio.id,
//                         domicilios: productosFormat,
//                         destino: domicilio.id_cliente.direccion,
//                         estado: domicilio.estado,
//                         total: total,
//                     };
//                 })
//             );

//             const pedidosData = await Promise.all(
//                 pedidos.map(async (pedido) => {
//                     const productosData = await fetchAllData(pedido.id, 'pedidos');

//                     const productosFormat = productosData.map((producto) => ({
//                         producto: producto.nombre,
//                         cantidad: producto.cantidad,
//                     }));

//                     const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
//                     ventaTotalTemp += total;

//                     productosData.forEach((producto) => {
//                         if (ventasPorProductoTemp[producto.nombre]) {
//                             ventasPorProductoTemp[producto.nombre] += producto.cantidad;
//                         } else {
//                             ventasPorProductoTemp[producto.nombre] = producto.cantidad;
//                         }
//                     });

//                     return {
//                         id: pedido.id,
//                         pedidos: productosFormat,
//                         destino: `Mesa ${pedido.id_mesa.id}`,
//                         estado: pedido.estado,
//                         total: total,
//                     };
//                 })
//             );

//             setRows([...domiciliosData, ...pedidosData]);
//             setVentaTotal(ventaTotalTemp);
//             setVentasPorProducto(ventasPorProductoTemp);
//         };

//         if (domicilios.length > 0 || pedidos.length > 0) {
//             generateRows();
//         }
//     }, [domicilios, pedidos]);

//     return (
//         <Box>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 checkboxSelection
//                 onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
//             />
//             <Button onClick={handleOpen}>Ver Reporte</Button>
//             <Modal
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="modal-modal-title"
//                 aria-describedby="modal-modal-description"
//             >
//                 <Box sx={modalStyle}>
//                     <Typography id="modal-modal-title" variant="h6" component="h2">
//                         Reporte de Ventas
//                     </Typography>
//                     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                         Venta Total: ${ventaTotal}
//                     </Typography>
//                     <List>
//                         {Object.entries(ventasPorProducto).map(([producto, cantidad]) => (
//                             <ListItem key={producto}>
//                                 <ListItemText primary={`${producto}: ${cantidad} unidades`} />
//                             </ListItem>
//                         ))}
//                     </List>
//                     <Button onClick={handleClose}>Cerrar</Button>
//                 </Box>
//             </Modal>
//         </Box>
//     );
// };

//export default Prueba1;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Modal, ListItem, ListItemText } from '@mui/material';
import Swal from 'sweetalert2';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { List } from "@mui/material";

// const columns = [
//     { field: 'id', headerName: 'ID', width: 70, align: 'left' },
//     {
//         field: 'detalles',
//         headerName: 'Detalles',
//         width: 300,
//         renderCell: (params) => (
//             <div>
//                 {/* Renderizar pedidos */}
//                 {params.row.pedidos && params.row.pedidos.map((pedido, index) => (
//                     <span key={`pedido-${params.row.id}-${index}`}>
//                         <Typography noWrap>
//                             {pedido.producto} ({pedido.cantidad})
//                         </Typography>
//                     </span>
//                 ))}
//                 {/* Renderizar domicilios */}
//                 {params.row.domicilios && params.row.domicilios.map((domicilio, index) => (
//                     <span key={`domicilio-${params.row.id}-${index}`}>
//                         <Typography noWrap>
//                             {domicilio.producto} ({domicilio.cantidad})
//                         </Typography>
//                     </span>
//                 ))}
//             </div>
//         ),
//     },
//     { field: 'destino', headerName: 'Destino', width: 210 },
//     { field: 'estado', headerName: 'Estado', width: 210 },
//     { field: 'total', headerName: 'Total', type: 'number', width: 120 },
// ];

const columns = [
    //{ field: 'id', headerName: 'ID', width: 70, align: 'left' },
    {
        field: 'detalles',
        headerName: 'Detalles',
        width: 300,
        renderCell: (params) => (
            <div>
                {/* Renderizar pedidos */}
                {params.row.pedidos && params.row.pedidos.map((pedido, index) => (
                    <span key={`pedido-${params.row.id}-${index}`}>
                        <Typography noWrap>
                            {pedido.producto} ({pedido.cantidad})
                        </Typography>
                    </span>
                ))}
                {/* Renderizar domicilios */}
                {params.row.domicilios && params.row.domicilios.map((domicilio, index) => (
                    <span key={`domicilio-${params.row.id}-${index}`}>
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

const Prueba1 = () => {
    const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [domicilios, setDomicilios] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingDomicilios, setLoadingDomicilios] = useState(true);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorDomicilios, setErrorDomicilios] = useState(null);
    const [open, setOpen] = useState(false);
    const [ventaTotal, setVentaTotal] = useState(0);
    const [ventasPorProducto, setVentasPorProducto] = useState({});

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
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
                const filteredDomicilios = response.data.filter(domicilio => domicilio.estado === "PAGADO");
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
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "PAGADO");
                setPedidos(filteredPedidos);
                setLoadingPedidos(false);
            } catch (error) {
                setErrorPedidos(error);
                setLoadingPedidos(false);
            }
        };
        fetchPedidos();
    }, []);

    const fetchProductos = async (id, tipo) => {
        try {
            const url = tipo === 'domicilios'
                ? `http://localhost:8085/api/v1/detallepedidosdom/${id}/productos`
                : `http://localhost:8085/api/v1/detallepedidos/${id}/productos`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            return [];
        }
    };

    useEffect(() => {
        const generateRows = async () => {
            let ventaTotalTemp = 0;
            const ventasPorProductoTemp = {};

            const fetchAllData = async (id, tipo) => {
                const productosData = await fetchProductos(id, tipo);
                return productosData;
            };

            const domiciliosData = await Promise.all(
                domicilios.map(async (domicilio) => {
                    const productosData = await fetchAllData(domicilio.id, 'domicilios');

                    const productosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
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
                        domicilios: productosFormat,
                        destino: domicilio.id_cliente.direccion,
                        estado: domicilio.estado,
                        total: total,
                    };
                })
            );

            const pedidosData = await Promise.all(
                pedidos.map(async (pedido) => {
                    const productosData = await fetchAllData(pedido.id, 'pedidos');

                    const productosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
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
                        pedidos: productosFormat,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                        estado: pedido.estado,
                        total: total,
                    };
                })
            );

            setRows([...domiciliosData, ...pedidosData]);
            setVentaTotal(ventaTotalTemp);
            setVentasPorProducto(ventasPorProductoTemp);
        };

        if (domicilios.length > 0 || pedidos.length > 0) {
            generateRows();
        }
    }, [domicilios, pedidos]);

    return (
        <Box>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
            />
            <Button onClick={handleOpen}>Ver Reporte</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Reporte de Ventas
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Venta Total: ${ventaTotal}
                    </Typography>
                    <List>
                        {Object.entries(ventasPorProducto).map(([producto, cantidad]) => (
                            <ListItem key={producto}>
                                <ListItemText primary={`${producto}: ${cantidad} unidades`} />
                            </ListItem>
                        ))}
                    </List>               
              <Button onClick={handleClose}>Cerrar</Button>
            </Box>
           </Modal>
        </Box>
    );
 };

export default Prueba1;