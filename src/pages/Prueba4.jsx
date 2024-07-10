import React, { useState, useEffect } from "react";
import axios from "axios";
import { ButtonGroup, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Prueba4 = () => {

    const [id, setId] = useState();
    const [id_pedido, setId_Pedido] = useState("");
    const [id_producto, setIdProducto] = useState("");
    const [cantidad, setCantidad] = useState();
    const [observacion, setObservacion] = useState("");
    const [estadoDetalle, setEstadoDetalle] = useState("");
    const [despachar, setDespachar] = useState(false);

    const [pedidos, setPedidos] = useState([]);
    const [detallesPedido, setDetallesPedido] = useState([]);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/pedidos");
            const pedidosWithData = await fetchPedidosWithData(response.data);
            setPedidos(pedidosWithData);
        } catch (error) {
            console.error("Error fetching pedidos:", error);
        }
    };

    const fetchProductos = async (pedidoId) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);
            return response.data;
        } catch (error) {
            console.error("Error fetching productos:", error);
            return [];
        }
    };

    const fetchPedidosWithData = async (pedidosData) => {
        const pedidosWithData = await Promise.all(
            pedidosData.map(async (pedido) => {
                try {
                    const productosData = await fetchProductos(pedido.id);
                    const total = calcularTotal(productosData);
                    const nombreProductos = productosData.map((producto) => ({
                        id: producto.id,
                        nombre: producto.nombre,
                        cantidad: producto.cantidad,
                        observacion: producto.observacion,
                        estadoDetalle: producto.estadoDetalle,
                    }));
                    return {
                        id: pedido.id,
                        nombreProductos: nombreProductos,
                        total: total,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                    };
                } catch (error) {
                    console.error("Error fetching productos for pedido:", pedido.id, error);
                    return {
                        id: pedido.id,
                        nombreProductos: [],
                        total: 0,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                    };
                }
            })
        );
        return pedidosWithData;
    };

    const calcularTotal = (productosData) => {
        return productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    };

    const [idPedido, setIdPedido] = useState("");

    const despacharDetallePedido = async (pedido) => {
        try {
            const productosData = await fetchProductos(pedido.id);
            console.log("Esto es pedido.id", pedido.id)
            console.log("Esto es pedido", pedido)
            console.log("Esto es pedido.id", pedido.nombreProductos)
            console.log("Esto es pedido.id", pedido.destino)
            const detallesPedido = productosData.map((producto) => ({

                id: producto.id,
                id_pedido: pedido.id,
                id_producto: producto.id,
                nombre: producto.nombre,
                cantidad: producto.cantidad,
                observacion: producto.observacion,
                estadoDetalle: producto.estadoDetalle,

                seleccionado: false,
            }));
            console.log("Hola", productosData);
            setDetallesPedido(detallesPedido);
            setIdPedido(pedido.id);
        } catch (error) {
            console.error("Error fetching productos for pedido:", pedido.id, error);
        }
    };

    const handleCheckboxChange = (productoId) => {
        const updatedDetallesPedido = detallesPedido.map((detalle) =>
            detalle.id === productoId ? { ...detalle, seleccionado: !detalle.seleccionado } : detalle
        );
        setDetallesPedido(updatedDetallesPedido);
    };

    const actualizarEstadoDetalle = async (pedido) => {
        try {
            const detallesSeleccionados = detallesPedido.filter((detalle) => detalle.seleccionado);
            console.log("seleccionados", detallesSeleccionados)
            
            await axios.put(`http://localhost:8085/api/v1/detallepedidos`, {
                //id:detalle,
                id_pedido,
                id_producto,
                cantidad,
                observacion,
                estadoDetalle,
            });

            MySwal.fire({
                title: "<strong>Actualización exitosa!!!</strong>",
                html: "<i>El estado del detalle fue actualizado con éxito!</i>",
                icon: "success"
            });

            fetchPedidos();
        } catch (error) {
            console.error("Error updating estado detalle:", error);
        }
    };

    const DespacharDetallePedido = (val) => {
        setDespachar(true);
        setId(val.id);
        setId_Pedido(val.id_pedido);
        setIdProducto(val.id_producto);
        setCantidad(val.cantidad);
        setObservacion(val.observacion);
        setEstadoDetalle(val.estadoDetalle);
    };


    return (
        <div>
            <div className="card-footer text-muted">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Pedidos</th>
                            <th scope="col">Destino</th>
                            <th scope="col">Total</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td>
                                    {pedido.nombreProductos.map((producto) => (
                                        <div key={producto.id}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>{producto.nombre}</td>
                                                        <td>({producto.cantidad})</td>
                                                        <td>{producto.observacion}</td>
                                                        <td>{producto.estadoDetalle}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </td>
                                <td>{pedido.destino}</td>
                                <td>{pedido.total}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button variant="secondary" onClick={() => DespacharDetallePedido(pedido)}>Despachar</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {detallesPedido.length > 0 && (
                    <div>
                        <h4>Seleccionar detalles para despachar:</h4>
                        <Form>
                            {detallesPedido.map((detalle) => (
                                <Form.Check
                                    key={detalle.id}
                                    type="checkbox"
                                    label={`${detalle.nombre}${(detalle.cantidad)} ${detalle.observacion} ${detalle.estadoDetalle}`}
                                    checked={detalle.seleccionado}
                                    onChange={() => handleCheckboxChange(detalle.id)}
                                />
                            ))}
                            <Button variant="primary" onClick={actualizarEstadoDetalle}>Despachar productos</Button>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prueba4;
