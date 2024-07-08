import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PedidosTable = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido =>pedido.estado === "PEDIDO");
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
            console.log(response.data);
            return response.data;
        } catch (error) {
            setErrorProductos(error);
            return [];
        }
    };

    return (
        <div>
            <h2>Pedidos</h2>
            {loadingPedidos ? (
                <p>Cargando Pedidos...</p>
            ) : errorPedidos ? (
                <p>Error al cargar pedidos: {errorPedidos.message}</p>
            ) : (
                <ul>
                    {pedidos.map(pedido => (
                        <li key={pedido.id}>{pedido.nombre}</li>
                    ))}
                </ul>
            )}

            <h2>Productos por Pedido</h2>
            <button onClick={() => fetchProductos(1)}>Obtener Productos</button>
            {errorProductos && <p>Error al obtener productos: {errorProductos.message}</p>}
        </div>
    );
};

export default PedidosTable;
