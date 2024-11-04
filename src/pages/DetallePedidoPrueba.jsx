import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Modal, ListGroup, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const DetallePedidoPrueba = () => {
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState([]);
    const [show, setShow] = useState(false);

    
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "PEDIDO");
                setPedidos(filteredPedidos);
               
               
            } catch (error) {
                console.error("Error fetching pedidos:", error);
            }
        };

        fetchPedidos();
    }, []);

    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            const rows = await Promise.all(
                pedidos.map(async (pedido) => {
                    const productosData = await fetchProductos(pedido.id);
                    const pedidosFormat = productosData.map((producto) => ({
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                        estado: producto.estadoDetalle,
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

    const fetchProductos = async (pedidoId) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);
            
            return response.data;
        } catch (error) {
            console.error("Error fetching productos:", error);
            return [];
        }
    };

    const handleRowSelect = (pedido) => {
        setSelectedRowsData([pedido]);
        setShow(true);
        setSelectedPedido(pedido.pedidos);
    };

    const handleModalDespachar = async () => {
        const pedidoId = selectedRowsData[0].id;
        try {
            // Obtener los datos del pedido actual
            const response = await axios.get(`http://localhost:8085/api/v1/pedidos/${pedidoId}`);
            const pedidoData = response.data.data;

            // Actualizar el estado del pedido a "DESPACHADO"
            const updatedPedido = {
                ...pedidoData,
                estado: 'DESPACHADO',
            };
            await axios.put(`http://localhost:8085/api/v1/pedidos`, updatedPedido);

            handleClose();
            navigate("/despachados")

        } catch (error) {
            
        navigate("/pedidos")
        
            console.error("Error despachando productos:", error);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un problema al despachar el pedido. Intente nuevamente.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container">
            <h2>Detalles de Pedidos</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Productos pedidos</th>
                        <th>Destino</th>
                        <th>Estado</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {loadingProductos ? (
                        <tr>
                            <td colSpan="6">Cargando...</td>
                        </tr>
                    ) : (
                        rows.map((pedido) => (
                            <tr key={pedido.id} onClick={() => handleRowSelect(pedido)}>
                                <td>{pedido.id}</td>
                                <td>
                                    {pedido.pedidos.map((producto, index) => (
                                        <div key={index}>
                                            {producto.producto} (Cantidad: {producto.cantidad})
                                        </div>
                                    ))}
                                </td>
                                <td>{pedido.destino}</td>
                                <td>{pedido.estado}</td>
                                <td>${pedido.total.toFixed(2)}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button 
                                            variant="primary" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShow();
                                            }} 
                                        >
                                            Despachar
                                        </Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {selectedPedido.map((producto, index) => (
                            <ListGroup.Item key={index}>
                                {producto.producto} (Cantidad: {producto.cantidad})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleModalDespachar}>
                        Despachar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DetallePedidoPrueba;