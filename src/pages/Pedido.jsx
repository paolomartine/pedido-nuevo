import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Pedido() {
    const [id, setId] = useState();
    const [id_mesa, setIdMesa] = useState("");
    const [id_cliente, setIdCliente] = useState("");
    const [estado, setEstado] = useState("");
    const [mesas, setMesas] = useState([]);
    const [editar, setEditar] = useState(false);
    const [pedidosList, setPedidos] = useState([]);
    const [clientesList, setClientes] = useState([]); // Lista de clientes para seleccionar

    useEffect(() => {
        axios.get('http://localhost:8085/api/v1/clientes')
            .then(response => setClientes(response.data))
            .catch(error => console.error('Error fetching clientes:', error));

        axios.get('http://localhost:8085/api/v1/mesas')
            .then(response => setMesas(response.data))
            .catch(error => console.error('Error fetching mesas:', error));

        axios.get('http://localhost:8085/api/v1/pedidos')
            .then(response => setPedidos(response.data))
            .catch(error => console.error('Error fetching pedidos:', error));
    }, []);

    const add = () => {
        if (id_mesa === "" || id_cliente === "" || estado === "") {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puede enviar campos vacíos!",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
        } else {
            axios.post("http://localhost:8085/api/v1/pedidos", {
                id_mesa,
                id_cliente,
                estado,
            })
            .then(() => {
                getPedidos();
                limpiarCampos();
                MySwal.fire({
                    title: "<strong>Registro exitoso!!!</strong>",
                    html: "<i> <strong>El pedido fue creado con éxito!</strong>",
                    icon: "success"
                });
            })
            .catch(error => {
                console.error(error);
                MySwal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al agregar el pedido. Por favor, intente de nuevo."
                });
            });
        }
    };
    const add1 = () => {

        if (id_cliente == "" || id_mesa == "" || estado == "" ) {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puede enviar campos vacios!",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
            limpiarCampos();
        } else
            axios
                .post("http://localhost:8085/api/v1/pedidos", {
                    id_cliente,
                    id_mesa,
                    estado,
                   
                })
                .then(() => {
                    getPedidos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "<strong>Registro exitoso!!!</strong> ",
                        html: "<i> <strong> El pedido " + id + " fue creado con éxito! </i>",
                        icon: "success"
                    });
                });
    };


    const update = () => {
        axios.put(`http://localhost:8085/api/v1/pedidos/${id}`, {
            id_mesa,
            id_cliente,
            estado,
        })
        .then(() => {
            getPedidos();
            MySwal.fire({
                title: "<strong>Actualización exitosa!!!</strong>",
                html: "<i> <strong>El pedido fue actualizado con éxito!</strong>",
                icon: "success"
            });
            limpiarCampos();
        })
        .catch(error => {
            console.error(error);
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al actualizar el pedido. Por favor, intente de nuevo."
            });
        });
    };

    const eliminar = (pedido) => {
        MySwal.fire({
            title: `¿Estás seguro de eliminar el pedido #${pedido.id}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8085/api/v1/pedidos/${pedido.id}`).then(() => {
                    getPedidos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "Eliminado!",
                        text: `El pedido #${pedido.id} ha sido eliminado`,
                        icon: "success"
                    });
                })
                .catch(error => {
                    console.error(error);
                    MySwal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al eliminar el pedido. Por favor, intente de nuevo."
                    });
                });
            }
        });
    }

    const limpiarCampos = () => {
        setId("");
        setIdMesa("");
        setIdCliente("");
        setEstado("");
    }

    const editarPedido = (pedido) => {
        setEditar(true);
        setId(pedido.id);
        setIdMesa(pedido.id_mesa);
        setIdCliente(pedido.id_cliente);
        setEstado(pedido.estado);
    };

    const getPedidos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/pedidos");
            setPedidos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getClientes = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/clientes");
            setClientes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "id_mesa") setIdMesa(value);
        else if (name === "id_cliente") setIdCliente(value);
        else if (name === "estado") setEstado(value);
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Pedidos</div>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">ID Mesa:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="id_mesa"
                        className="form-control"
                        value={id_mesa}
                        placeholder="ID de Mesa"
                        aria-label="ID Mesa"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon2">ID Cliente:</span>
                    <select
                        onChange={handleChange}
                        name="id_cliente"
                        className="form-select"
                        value={id_cliente}
                        aria-label="ID Cliente"
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientesList.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon3">Estado:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="estado"
                        value={estado}
                        className="form-control"
                        placeholder="Estado del Pedido"
                        aria-label="Estado"
                        aria-describedby="basic-addon3"
                    />
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
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ID Mesa</th>
                        <th scope="col">ID Cliente</th>
                        <th scope="col">Estado</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosList.map((pedido, index) => (
                        <tr key={pedido.id}>
                            <th scope="row">{pedido.id}</th>
                            <td>{pedido.id_mesa}</td>
                            <td>{pedido.id_cliente}</td>
                            <td>{pedido.estado}</td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="secondary" onClick={() => editarPedido(pedido)}>Editar</Button>
                                    <Button onClick={() => eliminar(pedido)} variant="danger">Eliminar</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Pedido;
