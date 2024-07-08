import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button, Modal, List, ListItem, ListItemText } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const DetallePedido = () => {
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState([]);
    const [checkedProductos, setCheckedProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setCheckedProductos([]);
        localStorage.removeItem('selectedProductos');
        navigate("/despachados")
    };

    

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "PEDIDO");
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
            console.error("Error fetching productos:", error);
            return [];
            
        }
        
    };
    
    useEffect(() => {
        const generateRows = async () => {
            if (pedidos.length === 0) return;

            const rowsData = [];
            for (const pedido of pedidos) {
                const productosData = await fetchProductos(pedido.id);
                const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                console.log(pedido.id);
                console.log(pedidos);
                console.log(productosData);
                console.log(total);
                rowsData.push({
                    id: pedido.id,
                    productos: productosData,
                    destino: `Mesa ${pedido.id_mesa.id}`,
                    estado: pedido.estado,
                    total: total.toFixed(2),
                });
            }
            setRows(rowsData);
        };

        generateRows();
    }, [pedidos]);

    const handleDespachar = async (pedidoId) => {
        try {
            const productos = await fetchProductos(pedidoId);
            setSelectedPedido(productos);
            handleOpen();
        } catch (error) {
            console.error("Error fetching productos:", error);
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
        const pedidoId = selectedRowsData[0].id;
        try {
            // Actualizar el estado del pedido a "DESPACHADO"
            await axios.put(`http://localhost:8085/api/v1/pedidos/${pedidoId}`, { estado: 'DESPACHADO' });

            // Actualizar la disponibilidad de la mesa a false
            const mesaId = selectedRowsData[0].id_mesa.id;
            await axios.put(`http://localhost:8085/api/v1/mesas/${mesaId}`, { disponibilidad: false });

            console.log("Productos despachados:", checkedProductos);
            handleClose();
        } catch (error) {
            console.error("Error despachando productos:", error);
        }
    };

    if (loadingPedidos) return <div>Cargando pedidos...</div>;
    if (errorPedidos) return <div>Error cargando pedidos: {errorPedidos.message}</div>;

    return (
        <div className="container mt-5">
            <Typography variant="h6" gutterBottom>
                Pedidos
            </Typography>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Productos</th>
                        <th scope="col">Destino</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Total</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    {rows.map((row) => (
        <tr key={row.id}>
            <th scope="row">{row.id}</th>
            <td>
                {row.productos.map((producto) => (
                    <div key={producto.id}>
                        <p>{producto.nombre} ({producto.cantidad})</p>
                        <p>Observación: {producto.observacion}</p>
                        <p>Estado: {producto.estadoDetalle}</p>
                    </div>
                ))}
            </td>
            <td>{row.destino}</td>
            <td>{row.estado}</td>
            <td>${row.total}</td>
            <td>
                <Button variant="primary" onClick={() => handleDespachar(row.id)}>
                    Despachar
                </Button>
            </td>
        </tr>
    ))}
</tbody>

            </table>
            <Modal open={open} onClose={handleClose}>
                <div>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Detalles del Pedido
                    </Typography>
                    <List>
                        {selectedPedido.map((producto, index) => (
                            <ListItem key={index} onClick={handleToggle(producto)}>
                                <ListItemText
                                    primary={`Producto: ${producto.nombre} (Cantidad: ${producto.cantidad})`}
                                    secondary={`Total: $${(producto.precio * producto.cantidad).toFixed(2)}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleModalDespachar}
                        disabled={checkedProductos.length !== selectedPedido.length}
                    >
                        Despachar
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default DetallePedido;
