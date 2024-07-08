import React, { useState, useEffect } from "react";
import axios from "axios";
import { ButtonGroup, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Prueba5 = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const pedidosWithData = await fetchPedidosWithData(response.data);
                setPedidos(pedidosWithData);
            } catch (error) {
                console.error("Error fetching pedidos:", error);
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

    const fetchPedidosWithData = async (pedidosData) => {
        const pedidosWithData = await Promise.all(
            pedidosData.map(async (pedido) => {
                try {
                    const productosData = await fetchProductos(pedido.id);
                    const total = calcularTotal(productosData);
                    const nombreProductos = productosData.map((producto) => ({
                        ...producto,  // Agrega todos los campos de producto
                        checked: false  // Agrega la propiedad 'checked' inicializada en false
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

    // Función para manejar el cambio de estado de los checkboxes
    const handleCheckboxChange = (pedidoId, productoIndex) => {
        const updatedPedidos = pedidos.map(pedido => {
            if (pedido.id === pedidoId) {
                const updatedProductos = pedido.nombreProductos.map((producto, index) => {
                    if (index === productoIndex) {
                        return {
                            ...producto,
                            checked: !producto.checked
                        };
                    }
                    return producto;
                });
                return {
                    ...pedido,
                    nombreProductos: updatedProductos
                };
            }
            return pedido;
        });
        setPedidos(updatedPedidos);
    };

    // Función para despachar productos seleccionados
    const despacharProductos = async (pedidoId) => {
        try {
            const productosDespachados = pedidos.find(pedido => pedido.id === pedidoId).nombreProductos.filter(producto => producto.checked);
            // Aquí realizar la lógica para despachar los productos seleccionados
            console.log("Productos despachados:", productosDespachados);
        } catch (error) {
            console.error("Error despachando productos:", error);
        }
    };

    return (
        <div>
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
                                {pedido.nombreProductos.map((producto, index) => (
                                    <div key={index}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>{producto.nombre}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{producto.observacion}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={producto.checked}
                                                            onChange={() => handleCheckboxChange(pedido.id, index)}
                                                        />
                                                    </td>
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
                                    <Button variant="info" onClick={() => despacharProductos(pedido.id)}>Despachar</Button>
                                    <Button variant="danger">Cancelar</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Prueba5;
