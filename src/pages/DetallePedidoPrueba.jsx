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
                const filteredPedidos = response.data.filter(pedido => {
                    const detallePedidosEnPedido = pedido.detallePedidos || [];
                    const estadoDetallePedidos = detallePedidosEnPedido.some(detalle => detalle.estado === "PEDIDO");
                    return pedido.estado === "PEDIDO" || estadoDetallePedidos;
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

    /* const handleModalDespacharPrueba= async()=>{
        const pedidoId = selectedRowsData[0].id;
        const mesaId = selectedRowsData[0].mesaId; // Obtener el mesaId desde el pedido seleccionado
        console.log(mesaId)
        console.log(pedidoId)
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


            // Actualizar la mesa a disponible
            //await updateMesa(mesaId);

            handleClose();
            navigate("/despachados");

        } catch (error) {
            navigate("/pedidos");
            console.error("Error procesando el pago:", error);
            MySwal.fire({
                title: "Error",
                text: "Ocurrió un problema al procesar el despacho. Intente nuevamente.",
                icon: "error",
            });
        }
    }; */

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
    
            // Despachar productos del pedido (esto actualizará el estado del producto a "DESPACHADO")
            /* for (const producto of selectedRowsData[0].productos) {
                if (producto.selected) {  // Solo despachar productos seleccionados
                    await axios.put(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos/${producto.id}`);
                }
            } */
    
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
    

    const handleModalDespachar = async () => {
        const selectedProductos = selectedPedido.filter(producto => producto.selected);
        console.log("Productos seleccionados: ", selectedProductos);

        if (selectedProductos.length === 0) {
            MySwal.fire({
                title: "Error",
                text: "Por favor, seleccione al menos un producto para despachar.",
                icon: "error",
            });
            return;
        }

        const confirmDespachar = await MySwal.fire({
            title: '¿Deseas despachar los productos seleccionados?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, despachar',
            cancelButtonText: 'No',
        });

        if (confirmDespachar.isConfirmed) {
            try {
                const promises = selectedProductos.map((producto) => {
                    if (!producto.id) {
                        console.log("Producto no tiene id:", producto);
                        producto.estado = 1;
                        return Promise.resolve();
                    }

                    const updatedProducto = {
                        ...producto,
                        estado_detalle: "DESPACHADO", 
                    };

                    return axios.put(`http://localhost:8085/api/v1/detallepedidos/${producto.id}`, updatedProducto)
                        .then(() => {
                            MySwal.fire({
                                title: "<strong>Actualización exitosa!!!</strong>",
                                html: `<i><strong> El producto ${producto.nombre} fue despachado con éxito! </i>`,
                                icon: "success",
                            });
                        })
                        .catch((error) => {
                            console.error(`Error al actualizar producto con id ${producto.id}:`, error);
                            MySwal.fire({
                                title: "Error",
                                text: `Hubo un problema al despachar el producto ${producto.nombre}.`,
                                icon: "error",
                            });
                        });
                });

                await Promise.all(promises);
                console.log('Todos los productos han sido actualizados correctamente.');
                handleClose();  
                navigate("/despachados");  
            } catch (error) {
                console.error("Error despachando productos:", error);
                MySwal.fire({
                    title: "Error",
                    text: "Ocurrió un problema al despachar los productos. Intente nuevamente.",
                    icon: "error",
                });
            }
        }
    };

    const handleSelectProducto = (index) => {
        const updatedPedido = [...selectedPedido];
        updatedPedido[index].selected = !updatedPedido[index].selected;
        setSelectedPedido(updatedPedido);
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
                                            {producto.producto} (Cant: {producto.cantidad}) {producto.observacion}
                                        </div>
                                    ))}
                                </td>
                                <td>{pedido.destino}</td>
                                <td>{pedido.estado}</td>
                                <td>${pedido.total.toFixed(2)}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button onClick={() => { window.location.href = `/detallepedido`; }}>
                                            Agregar
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
