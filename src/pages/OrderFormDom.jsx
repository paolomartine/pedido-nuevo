import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const OrderFormDom = () => {
    const [domicilios, setDomicilios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState({
        domicilio: null,
        producto: null,
        cantidad: 0,
        observacion: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        obtenerDomicilios();
        obtenerProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "idDomicilio") {
            const selectedDomicilio = domicilios.find(domicilio => domicilio.id === parseInt(value));
            setFormData({
                ...formData,
                domicilio: selectedDomicilio
            });
        } else if (name === "idProducto") {
            const selectedProducto = productos.find(producto => producto.id === parseInt(value));
            setFormData({
                ...formData,
                producto: selectedProducto
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id_domicilio = formData.domicilio
        const id_producto = formData.producto
        const cantidad = formData.cantidad
        const observacion = formData.observacion
        try {
            const response = await axios.post('http://localhost:8085/api/v1/detallepedidosdom', {
                id_domicilio,
                id_producto,
                cantidad,
                observacion
            });
            MySwal.fire({
                title: "¿Quiéres pedir algo más?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Sí",
                denyButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("Qué otro producto deseas?", "", "success");
                    limpiarproycantidad();
                    navigate("/detallepedidodom")
                } else if (result.isDenied) {

                    Swal.fire("Domicilio terminado", "", "info");
                    limpiar();
                    navigate("/menu")
                }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const obtenerDomicilios = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/domicilios');
            setDomicilios(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
        }
    };

    const obtenerProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const limpiarproycantidad = () => {
        setFormData({
            domicilio: formData.domicilio,
            producto: null,
            cantidad: 0,
            observacion: ""
        });
    };

    const limpiar = () => {
        setFormData({
            domicilio: null,
            producto: null,
            cantidad: 0,
            observacion: ""
        });
    };



    return (
        <div className="container mt-3">
            <div className="card">
                <div className="card-header">
                    Producto-Cantidad
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="idPedido" className="form-label">Pedido</label>
                            <select
                                className="form-select"
                                name="idDomicilio"
                                value={formData.domicilio ? formData.domicilio.id : ""}
                                
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar Domicilio</option>
                                {domicilios.map((domicilio) => (
                                    <option key={domicilio.id} value={domicilio.id}>
                                        {domicilio.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="idProducto" className="form-label">Producto</label>
                            <select
                                className="form-select"
                                name="idProducto"
                                value={formData.producto ? formData.producto.id : ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cantidad" className="form-label">Cantidad</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cantidad" className="form-label">Observación<noscript></noscript></label>
                            <input
                                type="text"
                                className="form-control"
                                id="observacion"
                                name="observacion"
                                value={formData.observacion}
                                onChange={handleChange}
                            /> </div>

<div className="mb-3">
                            <label htmlFor="estado" className="form-label">
                                Estado
                            </label>
                            <select
                                id="estado"
                                name="estado"
                                className="form-select"
                                value={formData.estado}
                                onChange={handleChange}
                                required >
                                <option value={0}>Pedido</option>
                                <option value={1}>Despachado</option>
                                <option value={2}>Pagado</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderFormDom;


