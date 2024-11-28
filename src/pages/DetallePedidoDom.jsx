import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Modal, ListGroup, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const DetallePedidoDom = () => {
    const [domicilios, setDomicilios] = useState([]);  // Inicializamos como un array vacío
    const [rows, setRows] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [selectedRowsData, setSelectedRowsData] = useState([]);
    const [selectedDomicilio, setSelectedDomicilio] = useState([]);  // Inicializamos como un array vacío
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchDomicilios = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/domicilios");

                // Filtramos los domicilios para que solo incluyan aquellos con estado "PEDIDO" 
                // y aquellos que tienen el campo "borrado" igual a false
                const filteredDomicilios = response.data.filter(domicilio => {
                    const detallePedidosDomEnDomicilio = domicilio.detallePedidoDom || [];
                    const estadoDetallePedidosDom = detallePedidosDomEnDomicilio.some(detalle => detalle.estado === "PEDIDO");

                    // Filtramos por estado "PEDIDO" y "borrado = false"
                    return domicilio.estado === "PEDIDO" && domicilio.borrado === false || estadoDetallePedidosDom;
                });

                setDomicilios(filteredDomicilios);
            } catch (error) {
                console.error("Error fetching pedidos:", error);
            }
        };
        fetchDomicilios();
    }, []);

    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            const rows = await Promise.all(
                domicilios.map(async (domicilio) => {
                    const productosData = await fetchProductos(domicilio.id);
                    const domiciliosFormat = productosData.map((producto) => ({
                        id: producto.id,
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                        estado: producto.estado,
                        selected: false,
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

    const fetchProductos = async (domicilioId) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidosdom/${domicilioId}/productos`);
            return response.data;
        } catch (error) {
            console.error("Error fetching productos:", error);
            return [];
        }
    };

    const handleRowSelect = (domicilio) => {
        setSelectedRowsData([domicilio]);
        setSelectedDomicilio(domicilio.domicilios || []);  // Aseguramos que selectedDomicilio sea un array
        setShow(true);
    };

    const handleModalDespacharPrueba = async () => {
        const domicilioId = selectedRowsData[0].id;
        console.log(domicilioId);

        try {
            const response = await axios.get(`http://localhost:8085/api/v1/domicilios/${domicilioId}`);
            const domicilioData = response.data.data;

            // Actualizamos el estado del domicilio a "DESPACHADO"
            const updatedDomicilio = {
                ...domicilioData,
                estado: 'DESPACHADO',
            };
            await axios.put(`http://localhost:8085/api/v1/domicilios`, updatedDomicilio);
            handleClose();
            navigate("/envios");
        } catch (error) {
            navigate("/domicilios");
            console.error("Error procesando el domicilio:", error);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un problema al procesar el domicilio. Intente nuevamente.",
                icon: "error",
            });
        }
    };

    const handleSelectProducto = (index) => {
        const updatedDomicilio = [...selectedDomicilio];
        updatedDomicilio[index].selected = !updatedDomicilio[index].selected;
        setSelectedDomicilio(updatedDomicilio);
    };

    const handleEliminarDomicilio = async (domicilioId) => {
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "Una vez eliminado, no podrás recuperar este domicilio.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`http://localhost:8085/api/v1/domicilios/${domicilioId}/borrar`);
                    setDomicilios(prevDomicilios => prevDomicilios.filter(domicilio => domicilio.id !== domicilioId));

                    MySwal.fire({
                        title: "Domicilio Eliminado",
                        text: "El domicilio ha sido eliminado.",
                        icon: "success",
                    });
                } catch (error) {
                    console.error("Error al marcar el domicilio como borrado:", error);
                    MySwal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el domicilio. Intente nuevamente.",
                        icon: "error",
                    });
                }
            }
        });
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Domicilios</div>
            </div>

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
                        rows.map((domicilio) => (
                            !domicilio.borrado && (
                                <tr key={domicilio.id} onClick={() => handleRowSelect(domicilio)}>
                                    <td>{domicilio.id}</td>
                                    <td>
                                    {domicilio.domicilios.map((producto, index) => (
                                            <div key={index}>
                                                {producto.producto} (Cant: {producto.cantidad}) {producto.observacion}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{domicilio.destino}</td>
                                    <td>{domicilio.estado}</td>
                                    <td>${domicilio.total.toFixed().toLocaleString()}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button onClick={() => { window.location.href = `/detallepedidodom`; }}>
                                                Agregar
                                            </Button>
                                            <Button variant="danger" onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarDomicilio(domicilio.id);
                                            }}>
                                                Eliminar
                                            </Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Domicilio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {Array.isArray(selectedDomicilio) && selectedDomicilio.length > 0 ? (
                            selectedDomicilio.map((producto, index) => (
                                <ListGroup.Item key={index}>
                                    <input
                                        type="checkbox"
                                        checked={producto.selected || false}
                                        onChange={() => handleSelectProducto(index)}
                                    />
                                    {producto.descripcion} {producto.producto} (Cantidad: {producto.cantidad})
                                </ListGroup.Item>
                            ))
                        ) : (
                            <div>No hay productos seleccionados.</div>
                        )}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleModalDespacharPrueba}>
                        Despachar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DetallePedidoDom;
