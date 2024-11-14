import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Modal, ListGroup, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Despachados = () => {
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState([]);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Obtener los pedidos despachados
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "DESPACHADO");
                setPedidos(filteredPedidos);
            } catch (error) {
                console.error("Error fetching pedidos:", error);
            }
        };
        fetchPedidos();
    }, []);

    // Generar las filas de la tabla
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
                        mesaId: pedido.id_mesa.id // Agregar mesaId para su uso posterior
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

    const updateMesa = async (mesaId) => {
        const disponibilidad = true;
        try {
            await axios.put('http://localhost:8085/api/v1/mesas', {
                id: mesaId,
                disponibilidad: disponibilidad,
            });
        } catch (error) {
            console.error("Error actualizando la mesa:", error);
        }
    };

    const handleModalPagar = async () => {
        const pedidoId = selectedRowsData[0].id;
        const mesaId = selectedRowsData[0].mesaId;
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/pedidos/${pedidoId}`);
            const pedidoData = response.data.data;
            const updatedPedido = { ...pedidoData, estado: 'PAGADO' };
            await axios.put(`http://localhost:8085/api/v1/pedidos`, updatedPedido);
            await updateMesa(mesaId);
            handleClose();
            navigate("/ventas");
        } catch (error) {
            navigate("/pedidos");
            console.error("Error procesando el pago:", error);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un problema al procesar el pago. Intente nuevamente.",
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
                                <td>${pedido.total.toFixed().toLocaleString()}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button variant="primary" onClick={() => { window.location.href = `/detallepedido`; }}>Agregar</Button>
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
                    <hr />
                    <h5>Total del Pedido: ${selectedRowsData[0]?.total.toFixed()}</h5> {/* Muestra el total aquí */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                    <Button variant="primary" onClick={handleModalPagar}>Pagar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Despachados;
