import React, { useState, useEffect } from "react";
import axios from "axios";
import { ButtonGroup, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Prueba4 = () => {
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
                        estado_detalle: producto.estado_detalle,
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
            const detallesPedido = productosData.map((producto) => ({
                id: producto.id,
                nombre: producto.nombre,
                seleccionado: false,
            }));
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

    const actualizarEstadoDetalle = async () => {
        try {
            await axios.put(`http://localhost:8085/api/v1/detallepedidos`, {
                pedidoId: idPedido,
                detallesPedido: detallesPedido.filter((detalle) => detalle.seleccionado),
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
                                                        <td>{producto.estado_detalle}</td>
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
                                        <Button variant="secondary" onClick={() => despacharDetallePedido(pedido)}>Despachar</Button>
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
                                    label={`${detalle.nombre}`}
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
