import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ButtonGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PedidoForm = () => {
    const [estado, setEstado] = useState("");
    const [clientes, setClientes] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [pedidosList, setPedidos] = useState([]);
    const [id, setId] = useState("");
    const [mesaId, setMesaId] = useState("");
    const [clienteId, setClienteId] = useState("");
    const [editar, setEditar] = useState(false);
    const [formData, setFormData] = useState({
        id_cliente: '',
        id_mesa: '',
        estado: ''
    });


    const add = async () => {
        if (id_cliente === "" || id_mesa === "" || estado === "") {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puede enviar campos vacios!",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
            limpiarCampos();
            return;
        }
        try {
            const mesaResponse = await axios.get(`http://localhost:8085/api/v1/mesas/${mesaId}`);
            if (!mesaResponse.data) {
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "La mesa no existe",
                    footer: '<a href="#">Intente de nuevo?</a>'
                });
                return;
            }

            const clienteResponse = await axios.get(`http://localhost:8085/api/v1/clientes/${clienteId}`);
            if (!clienteResponse.data) {
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El cliente no existe",
                    footer: '<a href="#">Intente de nuevo?</a>'
                });
                return;
            }

            await axios.post("http://localhost:8085/api/v1/pedidos", {
                cliente: response.data,
                mesa: response.data,
                estado,
            });
            
            getPedidos();
            limpiarCampos();
            MySwal.fire({
                title: "<strong>Registro exitoso!!!</strong>",
                html: "<i> <strong> El pedido fue creado con éxito! </i>",
                icon: "success"
            });
        } catch (error) {
            console.error(error);
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo crear el pedido",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
        }
    }

    useEffect(() => {
        // Reemplaza 'http://host/api/clientes' y 'http://host/api/mesas' con las URLs reales de tu API
        axios.get('http://localhost:8085/api/v1/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error('Error fetching clientes:', error));

        axios.get('http://localhost:8085/api/v1/mesas')
            .then(response => setMesas(response.data))
            .catch(error => console.error('Error fetching mesas:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Reemplaza 'http://host/api/pedidos' con la URL real de tu API
        axios.post('http://localhost:8085/api/v1/pedidos', formData)
            .then(response => {
                console.log('Pedido creado:', response.data);
                // Manejar la respuesta de la API
            })
            .catch(error => console.error('Error creating pedido:', error));
    };

    const eliminar = (pedido) => {
        MySwal.fire({
            title: "Estas seguro de eliminar?",
            html: "<i> <strong> Desea eliminar el pedido " + pedido.id + " </i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8085/api/v1/pedidos/${pedido.id}`).then(() => {
                    getPedidos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "Eliminado!",
                        text: "El pedido #: " + pedido.id + ", ha sido eliminado!",
                        icon: "success"
                    })
                });
            }
        });
    }

    const editarPedido = (val) => {
        setEditar(true);
        setId(val.id);
        setClienteId(val.cliente);
        setMesaId(val.mesa);
        setEstado(val.estado);
    };

    const getPedidos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/pedidos");
            setPedidos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const limpiarCampos = () => {
        setClienteId("");
        setMesaId("");
        setEstado("");
    }


    return (
        <div className="container mt-4">
            <h2>Crear Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="id_cliente" className="form-label">Cliente</label>
                    <select
                        id="id_cliente"
                        name="id_cliente"
                        className="form-select"
                        value={formData.id_cliente}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="id_mesa" className="form-label">Mesa</label>
                    <select
                        id="id_mesa"
                        name="id_mesa"
                        className="form-select"
                        value={formData.id_mesa}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una mesa</option>
                        {mesas.map(mesa => (
                            <option key={mesa.id} value={mesa.id}>
                                {mesa.id} - {mesa.disponibilidad ? 'Disponible' : 'No Disponible'}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Estado:</span>
                    <select 
                        name="estado" 
                        type="number"
                        onChange={handleChange}                        
                        value={formData.estado}
                        placeholder="Estado"
                        aria-label="Estado de pedido"
                        aria-describedby="basic-addon1"
                        >
                        <option value="0">Pedido</option>
                        <option value="1">Despachado</option>
                        <option value="2">Pagado</option>
                    </select>


                </div>
                <div className="card-footer text-muted">
                    {editar ? (
                        <div>
                            <Button className="btn btn-warning m-2" onClick={update}>Actualizar</Button>
                            <Button className="btn btn-info m-2" onClick={() => setEditar(false)}>Cancelar</Button>
                        </div>
                    ) : (
                        <Button className="btn btn-primary" onClick={add}>Registrar</Button>
                    )}
                </div>

                        <div>
                        <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Mesa</th>
                        <th scope="col">Estado</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosList.map((pedido) => (
                        <tr key={pedido.id}>
                            <th scope="row">{pedido.id}</th>
                            <td>{pedido.mesa}</td>
                            <td>{pedido.cliente}</td>
                            <td>{pedido.estado}</td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="secondary" onClick={() => editarPedido(pedido)}>Editar</Button>
                                    <Button onClick={() => {
                                        eliminar(pedido)
                                    }} variant="danger">Eliminar</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

                        </div>
                
                <button type="submit" className="btn btn-primary">Crear Pedido</button>
            </form>
        </div>
    );
};

const App = () => (
    <div className="container mt-4">
        <PedidoForm />
    </div>
);

export default App;

/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const PedidoForm = () => {
    const [clientes, setClientes] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [formData, setFormData] = useState({
        id_cliente: '',
        id_mesa: '',
        estado: '0'
    });

    useEffect(() => {
        // Reemplaza 'http://host/api/clientes' y 'http://host/api/mesas' con las URLs reales de tu API
        axios.get('http://host/api/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error('Error fetching clientes:', error));

        axios.get('http://host/api/mesas')
            .then(response => setMesas(response.data))
            .catch(error => console.error('Error fetching mesas:', error));

        axios.get('http://host/api/pedidos')
            .then(response => setPedidos(response.data))
            .catch(error => console.error('Error fetching pedidos:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Reemplaza 'http://host/api/pedidos' con la URL real de tu API
        axios.post('http://host/api/pedidos', formData)
            .then(response => {
                console.log('Pedido creado:', response.data);
                setPedidos([...pedidos, response.data]);
            })
            .catch(error => console.error('Error creating pedido:', error));
    };

    return (
        <div className="container mt-4">
            <h2>Crear Pedido</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="id_cliente" className="form-label">Cliente</label>
                    <select
                        id="id_cliente"
                        name="id_cliente"
                        className="form-select"
                        value={formData.id_cliente}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="id_mesa" className="form-label">Mesa</label>
                    <select
                        id="id_mesa"
                        name="id_mesa"
                        className="form-select"
                        value={formData.id_mesa}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una mesa</option>
                        {mesas.map(mesa => (
                            <option key={mesa.id} value={mesa.id}>
                                {mesa.id} - {mesa.disponibilidad ? 'Disponible' : 'No Disponible'}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                        id="estado"
                        name="estado"
                        className="form-select"
                        value={formData.estado}
                        onChange={handleChange}
                        required
                    >
                        <option value="0">Pedido</option>
                        <option value="1">Despachado</option>
                        <option value="2">Pagado</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Crear Pedido</button>
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
                            <td>{pedido.id_cliente.nombre}</td>
                            <td>{pedido.id_mesa.id}</td>
                            <td>{['Pedido', 'Despachado', 'Pagado'][pedido.estado]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const App = () => (
    <div className="container mt-4">
        <PedidoForm />
    </div>
);

export default App;

 */