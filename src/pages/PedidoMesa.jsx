

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PedidoForm = () => {
    const [clientes, setClientes] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const [mesaId, setMesaId] = useState('');
    const [estados, setEstados] = useState(0);

    useEffect(() => {
        axios
            .get('http://localhost:8085/api/v1/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error('Error fetching clientes:', error));


        axios
            .get('http://localhost:8085/api/v1/mesas')
            .then(response => setMesas(response.data))
            .catch(error => console.error('Error fetching mesas:', error));

        axios
            .get('http://localhost:8085/api/v1/pedidos')
            .then(response => setPedidos(response.data))
            .catch(error => console.error('Error fetching pedidos:', error));

    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'id_cliente') setClienteId(value);
        if (name === 'id_mesa') setMesaId(value);
        if (name === 'estado') setEstados(value);
    };

    const handleSubmit = e => {
        e.preventDefault();


        axios
            .post('http://localhost:8085/api/v1/pedidos', { clienteId, mesaId, estados })
            .then(response => {
                console.log('Pedido creado:', response.data);
                setPedidos([...pedidos, response.data]);
            })
            .catch(error => console.error('Error creating pedido:', error));

    };

    const add = () => {
        if (clienteId === '' || mesaId === '' || estados === '') {
            MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No puede enviar campos vacios!',
                footer: '<a href="#">Intente de nuevo?</a>'
            });
            limpiarCampos();
        } else
            axios
                .post("http://localhost:8085/api/v1/pedidos", {
                    clienteId,
                    mesaId,
                    estados
                })
                .then(() => {
                    getPedidos();
                    limpiarCampos();
                    MySwal.fire({
                        title: '<strong>Registro exitoso!!!</strong> ',
                        html:
                            '<i> <strong> El pedido de la mesa' +
                            mesaId +
                            ' fue creado con éxito! </i>',
                        icon: 'success'
                    });
                });

    };

    const limpiarCampos = () => {
        setClienteId("");
        setMesaId("");
        setEstados("");
    };

    const getPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:8085/api/v1/pedidos');
            setPedidos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Crear Pedido</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="id_cliente" className="form-label">
                        Cliente
                    </label>
                    <select 
                    id="id_cliente" 
                    name="id_cliente" 
                    className="form-select" 
                    value={clienteId} 
                    onChange={handleChange} 
                    required >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="id_mesa" className="form-label">
                        Mesa
                    </label>
                    <select
                        id="id_mesa"
                        name="id_mesa"
                        className="form-select"
                        value={mesaId}
                        onChange={handleChange}
                        required >
                        <option value="">Selecciona una mesa</option>
                        {mesas.map(mesa => (
                            <option key={mesa.id} value={mesa.id}>
                                {mesa.id} - {mesa.disponibilidad ? 'Disponible' : 'No Disponible'}
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
                        value={estados}
                        onChange={handleChange}
                        required >
                        <option value={0}>Pedido</option>
                        <option value={1}>Despachado</option>
                        <option value={2}>Pagado</option>
                    </select>
                </div>
                <button onClick={add} className="btn btn-primary">
                    Crear Pedido
                </button>
            </form>
            <h3 className="mt-4">Pedidos Guardados</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Mesa</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{pedido.id_cliente ? pedido.id_cliente.nombre : 'Nombre no disponible'}</td>
                            <td>{pedido.id_mesa ? pedido.id_mesa.id : 'Mesa no disponible'}</td>
                            <td>{pedido.estado}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

const App = () => (

    <div className="container mt-4"> <PedidoForm /> </div>);

export default App;