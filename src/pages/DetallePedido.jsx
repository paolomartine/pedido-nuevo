import React, { useState, useEffect } from "react";
import axios from "axios";

function DetallePedido() {
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                setPedidos(response.data);
                setLoadingPedidos(false);
            } catch (error) {
                setErrorPedidos(error);
                setLoadingPedidos(false);
            }
        };

        fetchPedidos();
    }, []);

    const fetchProductos = async (pedidoId) => {
        setLoadingProductos(true);
        setErrorProductos(null);
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);
            setProductos(response.data);
            setLoadingProductos(false);
        } catch (error) {
            setErrorProductos(error);
            setLoadingProductos(false);
        }
    };

    if (loadingPedidos) return <div>Cargando pedidos...</div>;
    if (errorPedidos) return <div>Error cargando pedidos: {errorPedidos.message}</div>;

    return (
       <div>

       </div>
    );
}

export default DetallePedido;
