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

                // Filtramos los pedidos para que solo incluyan aquellos con estado "PEDIDO" 
                // o aquellos que tienen el campo "borrado" igual a true
                const filteredPedidos = response.data.filter(pedido => {
                    const detallePedidosEnPedido = pedido.detallePedidos || [];
                    const estadoDetallePedidos = detallePedidosEnPedido.some(detalle => detalle.estado === "PEDIDO");

                    // Filtramos por estado "PEDIDO" o "borrado = true"
                    return pedido.estado === "PEDIDO" && pedido.borrado === false || estadoDetallePedidos;
                });

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
                        id: producto.id,
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                        estado: producto.estadoDetalle,
                        selected: false,
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
        setSelectedPedido(pedido.pedidos);
        setShow(true);
    };



    const handleModalDespacharPrueba = async () => {
        const pedidoId = selectedRowsData[0].id;
        const mesaId = selectedRowsData[0].mesaId; // Obtener el mesaId desde el pedido seleccionado
        console.log(mesaId);
        console.log(pedidoId);

        try {
            // Obtener los datos del pedido actual
            const response = await axios.get(`http://localhost:8085/api/v1/pedidos/${pedidoId}`);
            const pedidoData = response.data.data;

            // Actualizar el estado del pedido a "DESPACHADO"
            const updatedPedido = {
                ...pedidoData,
                estado: 'DESPACHADO', // Cambiar el estado del pedido a "DESPACHADO"
            };
            await axios.put(`http://localhost:8085/api/v1/pedidos`, updatedPedido);
            handleClose();
            navigate("/despachados");
        } catch (error) {
            navigate("/pedidos");
            console.error("Error procesando el despacho:", error);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un problema al procesar el despacho. Intente nuevamente.",
                icon: "error",
            });
        }
    };






    const handleSelectProducto = (index) => {
        const updatedPedido = [...selectedPedido];
        updatedPedido[index].selected = !updatedPedido[index].selected;
        setSelectedPedido(updatedPedido);
    };

    /* const handleEliminarPedido = async (pedidoId) => {
        
        try {
            // Llamamos a la API para marcar el pedido como borrado lógico
            const response = await axios.put(`http://localhost:8085/api/v1/pedidos/${pedidoId}/borrar`);
            
            // Actualizamos el estado de los pedidos en la UI
            setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== pedidoId));  // Eliminamos el pedido de la lista en la interfaz
    
            // Mostramos un mensaje de éxito
            MySwal.fire({
                title: "Pedido Marcado como Borrado",
                text: "El pedido ha sido marcado como borrado con éxito.",
                icon: "success",
            });
        } catch (error) {
            console.error("Error al marcar el pedido como borrado:", error);
            MySwal.fire({
                title: "Error",
                text: "Hubo un problema al procesar el borrado lógico del pedido. Intente nuevamente.",
                icon: "error",
            });
        }
    }; */

    /* const handleEliminarPedido = async (pedidoId, mesaId) => {
        try {
            // 1. Llamamos a la API para marcar el pedido como borrado lógico
            await axios.put(`http://localhost:8085/api/v1/pedidos/${pedidoId}/borrar`);
    
            // 2. Actualizar la mesa asignada para marcarla como disponible
            await updateMesaDisponibilidad(mesaId, true); // 'true' indica que la mesa está disponible
    
            // 3. Actualizamos el estado de los pedidos en la UI eliminando el pedido de la lista
            setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== pedidoId));
    
            // 4. Mostramos un mensaje de éxito
            MySwal.fire({
                title: "Pedido Marcado como Borrado",
                text: "El pedido ha sido marcado como borrado con éxito y la mesa está ahora disponible.",
                icon: "success",
            });
        } catch (error) {
            console.error("Error al marcar el pedido como borrado:", error);
            MySwal.fire({
                title: "Error",
                text: "Hubo un problema al procesar el borrado lógico del pedido y la actualización de la mesa. Intente nuevamente.",
                icon: "error",
            });
        }
    }; */

    const handleEliminarPedido = async (pedidoId, mesaId) => {
        // Verificamos que los datos sean correctos
        console.log("Pedido ID:", pedidoId);
        console.log("Mesa ID:", mesaId);
    
        // Validamos que mesaId esté presente
        if (!mesaId) {
            MySwal.fire({
                title: "Error",
                text: "Este pedido no tiene mesa asociada.",
                icon: "error",
            });
            return;
        }
    
        // Confirmación con SweetAlert
        MySwal.fire({
            title: "¿Estás seguro?",
            text: "Una vez eliminado, no podrás recuperar este pedido y la mesa quedará disponible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Llamamos a la API para marcar el pedido como borrado lógicamente
                    await axios.put(`http://localhost:8085/api/v1/pedidos/${pedidoId}/borrar`);
    
                    // Actualizamos la disponibilidad de la mesa
                    await axios.put(`http://localhost:8085/api/v1/mesas/${mesaId}/disponibilidad`, { disponibilidad: true });
    
                    // Eliminamos el pedido de la UI
                    setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== pedidoId));
    
                    // Mostramos un mensaje de éxito
                    MySwal.fire({
                        title: "Pedido Eliminado",
                        text: "El pedido ha sido eliminado y la mesa está disponible.",
                        icon: "success",
                    });
                } catch (error) {
                    console.error("Error al marcar el pedido como borrado:", error);
                    MySwal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el pedido. Intente nuevamente.",
                        icon: "error",
                    });
                }
            }
        });
    };
    


    const updateMesaDisponibilidad = async (mesaId, disponibilidad) => {
        try {
            await axios.put(`http://localhost:8085/api/v1/mesas/${mesaId}/disponibilidad`, {
                disponibilidad: disponibilidad, // Solo se pasa el campo 'disponibilidad'
            });
        } catch (error) {
            console.error("Error actualizando la disponibilidad de la mesa:", error);
            MySwal.fire({
                title: "Error",
                text: "Hubo un problema al actualizar la disponibilidad de la mesa. Intente nuevamente.",
                icon: "error",
            });
        }
    };




    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Pedidos</div>
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
                        rows.map((pedido) => (
                            // Solo mostramos pedidos que no estén marcados como borrados
                            !pedido.borrado && (
                                <tr key={pedido.id} onClick={() => handleRowSelect(pedido)}>
                                    <td>{pedido.id}</td>
                                    <td>
                                        {pedido.pedidos.map((producto, index) => (
                                            <div key={index}>
                                                {producto.producto} (Cant: {producto.cantidad}) {producto.observacion}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{pedido.destino}</td>
                                    <td>{pedido.estado}</td>
                                    <td>${pedido.total.toFixed().toLocaleString()}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button onClick={() => { window.location.href = `/detallepedido`; }}>
                                                Agregar
                                            </Button>
                                            <Button variant="danger" onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering row select
                                                const mesaId = pedido.destino.match(/\d+/);
                                                const numeroMesa = mesaId ? parseInt(mesaId[0], 10) : null; 
                                                console.log(numeroMesa)// O ajusta según cómo se obtiene mesaId
                                                handleEliminarPedido(pedido.id, numeroMesa);

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
                    <Modal.Title>Detalles del Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {selectedPedido.map((producto, index) => (
                            <ListGroup.Item key={index}>
                                <input
                                    type="checkbox"
                                    checked={producto.selected || false}
                                    onChange={() => handleSelectProducto(index)}
                                />
                                {producto.descripcion} {producto.producto} (Cantidad: {producto.cantidad})
                            </ListGroup.Item>
                        ))}
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

export default DetallePedidoPrueba;




