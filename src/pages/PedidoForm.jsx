import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { useNavigate } from "react-router-dom";


const MySwal = withReactContent(Swal);

const PedidoForm = () => {

    const [clientes, setClientes] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [formData, setFormData] = useState({
        cliente: null,
        mesa: null,
        estado: '0'
    });

    const navigate = useNavigate();

    useEffect(() => {
        obtenerClientes();
        obtenerMesas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "idCliente") {
            const selectedCliente = clientes.find(cliente => cliente.id === parseInt(value));
            setFormData({
                ...formData,
                cliente: selectedCliente
            });
        } else if (name === "idMesa") {
            const selectedMesa = mesas.find(mesa => mesa.id === parseInt(value));
            setFormData({
                ...formData,
                mesa: selectedMesa
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
        const id_cliente = formData.cliente
        const id_mesa = formData.mesa
        const estado = formData.estado

        try {
            const response = await axios.post('http://localhost:8085/api/v1/pedidos', {
                id_cliente,
                id_mesa,
                estado
            });
            update();
            limpiarFormulario();
            MySwal.fire({
                title: "El pedido ha empezado...",
                text: "Escoge tus productos favoritos!",
                icon: "burguer"
            });
            navigate("/detallepedido")
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    const update = async () => {
        const id = formData.mesa.id
        const disponibilidad = (false)
        console.log('Parametros:', id, disponibilidad);
        try {
            await axios.put('http://localhost:8085/api/v1/mesas', {
                id, disponibilidad,
            });
            limpiarFormulario();
        } catch (error) {
            console.error(error);
        }
    };


    const obtenerClientes = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener clientes:', error);
        }
    };

    const obtenerMesas = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/mesas');
            setMesas(response.data);
        } catch (error) {
            console.error('Error al obtener mesas:', error);
        }
    };

    const limpiarFormulario = () => {
        setFormData({
            cliente: null,
            mesa: null,
            estado: '0'
        });
    };

    return (
        <div className="container mt-3">
            <div className="card">
                <div className="card-header">
                    Pedido
                </div>
                <div className="card-body">
                    <form >
                        <div className="mb-3">
                            <label htmlFor="idCliente" className="form-label">Cliente</label>
                            <select
                                className="form-select"
                                name="idCliente"
                                value={formData.cliente ? formData.cliente.id : ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar mesero</option>
                                {clientes.filter(cliente => cliente.nombre === "Mesero1"||cliente.nombre ==="Mesero2").map(filteredCliente => (
                                    <option key={filteredCliente.id} value={filteredCliente.id}>
                                        {filteredCliente.nombre}                                
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="idMesa" className="form-label">Mesa</label>
                            <select
                                className="form-select"
                                name="idMesa"
                                value={formData.mesa ? formData.mesa.id : ""}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar mesa</option>
                                {mesas.filter(mesa => mesa.disponibilidad === true).map(filteredMesa => (
                                    <option key={filteredMesa.id} value={filteredMesa.id}>
                                        {filteredMesa.id}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PedidoForm;
