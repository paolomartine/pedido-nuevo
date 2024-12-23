import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup, Modal, ListGroup, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const DetallePedido = () => {
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

                // Mostrar la respuesta completa para entender la estructura de los datos
                console.log("Respuesta completa de pedidos:", response.data);

                // Filtramos los pedidos para que solo incluyan aquellos con estado "PEDIDO" 
                // o aquellos que tienen el campo "borrado" igual a true
                const filteredPedidos = response.data.filter(pedido => {
                    const detallePedidosEnPedido = pedido.detallePedidos || [];

                    // Verificamos que todos los detalles del pedido tengan estado "PEDIDO"
                    const todosEstadoDetallePedidos = detallePedidosEnPedido.every(detalle => detalle.estado_detalle === "PEDIDO");

                    // Mostrar cada detalle del pedido y si cumple con la condición
                    console.log("Pedido ID:", pedido.id);
                    console.log("Detalles del pedido:", detallePedidosEnPedido);
                    console.log("Todos los detalles están en estado 'PEDIDO'?", todosEstadoDetallePedidos);

                    // Filtramos por estado "PEDIDO" o "borrado = true", además de la condición de estadoDetalle "PEDIDO"
                    const shouldInclude = (pedido.estado === "PEDIDO" && pedido.borrado === false && todosEstadoDetallePedidos) ||
                        detallePedidosEnPedido.some(detalle => detalle.estado_detalle === "PEDIDO");

                    console.log("Pedido debería ser incluido?", shouldInclude);

                    return shouldInclude;
                });

                // Mostrar los pedidos filtrados
                console.log("Pedidos filtrados:", filteredPedidos);

                // Actualizamos el estado con los pedidos filtrados
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
                    console.log("Procesando pedido ID:", pedido.id); // Verificamos el ID del pedido

                    const productosData = await fetchProductos(pedido.id);
                    console.log("Productos obtenidos para pedido ID:", pedido.id); // Verificamos los productos obtenidos

                    // Verificamos los datos de productos y su 'estado_detalle'
                    productosData.forEach((producto, index) => {
                        console.log(`Producto ${index + 1}:`, producto); // Verificamos cada producto y su estado_detalle
                    });

                    const pedidosFormat = productosData.map((producto) => ({
                        id: producto.id,
                        producto: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                        estado_detalle: producto.estado_detalle, // El estado_detalle es el que nos interesa
                        selected: false,
                    }));

                    // Verificamos cómo se están formateando los productos
                    console.log("Productos formateados:", pedidosFormat);

                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    console.log("Total calculado para el pedido ID", pedido.id, ":", total); // Verificamos el total calculado

                    return {
                        id: pedido.id,
                        pedidos: pedidosFormat,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                        estado: pedido.estado,
                        id_cliente: pedido.id_cliente,
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
            console.log("Cargando productos para el pedido ID:", pedidoId); // Verificamos el pedido ID para el que se están cargando productos
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);

            // Verificamos la respuesta completa para ver si 'estado_detalle' está presente
            console.log("Respuesta de productos:", response.data);

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



    const handleModalDespachar = async () => {
        const pedidoId = selectedRowsData[0].id;
        const mesaId = selectedRowsData[0].mesaId; // Obtener el mesaId desde el pedido seleccionado

        console.log(mesaId);
        console.log(pedidoId);
        //console.log(productSeletioned)

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

// Esta función es la que actualiza los detalles seleccionados


    const handleSelectProducto = (index) => {
        const updatedPedido = [...selectedPedido];
        updatedPedido[index].selected = !updatedPedido[index].selected;
        setSelectedPedido(updatedPedido);
    };

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

    // Función para convertir el estado numérico a texto
const convertirEstado = (estado) => {
    switch(estado) {
        case 0:
            return "PEDIDO";
        case 1:
            return "DESPACHADO";
        case 2:
            return "PAGADO";
        default:
            return "Desconocido";
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
                        <th>Mesero</th>
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
                                                {producto.producto} (Cant: {producto.cantidad}) {producto.observacion} (Estado: {convertirEstado(producto.estado_detalle)})
                                            </div>
                                        ))}
                                    </td>
                                    <td>{pedido.id_cliente ? pedido.id_cliente.nombre : 'No asignado'}</td>
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
                                    //disabled={producto.estado_detalle !== "PEDIDO"} // Solo permitir seleccionar productos con estado "PEDIDO"
                                />
                                {producto.descripcion} {producto.producto} (Cantidad: {producto.cantidad})
                                (Estado: {convertirEstado(producto.estado_detalle)})
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

export default DetallePedido;






