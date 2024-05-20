import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function PedidoMesa() {
    const [id, setId] = useState("");
    const [mesaId, setMesaId] = useState("");
    const [clienteId, setClienteId] = useState("");
    const [estado, setEstado] = useState("");
    const [clienteResponse, setClienteResponse] = useState([]);
    const [mesaResponse, setMesaResponse] = useState([]);
    const [pedidosList, setPedidos] = useState([]);
    const [editar, setEditar] = useState(false);

    useEffect(() => {
        getPedidos();
        getMesas();
        getClientes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mesaId") setMesaId(value);
        if (name === "clienteId") setClienteId(value);
        if (name === "estado") setEstado(value);
    }

    const add = async () => {
        if (mesaId === "" || clienteId === "" || estado === "") {
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
                clienteResponse: clienteResponse.data,
                mesaResponse: mesaResponse.data,
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

    const update = async () => {
        try {
            await axios.put("http://localhost:8085/api/v1/pedidos", {
                id,
                clienteResponse,
                mesaResponse,
                estado,
            });
            getPedidos();
            MySwal.fire({
                title: "<strong>Actualización exitosa!!!</strong>",
                html: "<i> <strong> El pedido #:" + id + " fue actualizado con éxito! </i>",
                icon: "success"
            });
            limpiarCampos();
        } catch (error) {
            console.error(error);
        }
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

    const limpiarCampos = () => {
        setClienteId("");
        setMesaId("");
        setEstado("");
    }

    const editarPedido = (val) => {
        setEditar(true);
        setId(val.id);
        setClienteId(val.clienteResponse);
        setMesaId(val.mesaResponse);
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

    const getClientes = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/clientes");
            setClienteResponse(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getMesas = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/mesas");
            setMesaResponse(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Pedidos</div>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">ClienteId:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="clienteId"
                        className="form-control"
                        value={clienteId}
                        placeholder="id cliente"
                        aria-label="Id cliente"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">MesaId:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="mesaId"
                        className="form-control"
                        value={mesaId}
                        placeholder="Número de mesa"
                        aria-label="Mesa"
                        aria-describedby="basic-addon1"
                    />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Estado:</span>
                    <select 
                        name="estado" 
                        type="number"
                        onChange={handleChange}                        
                        value={estado}
                        placeholder="Estado"
                        aria-label="Estado de pedido"
                        aria-describedby="basic-addon1"
                        >
                        <option value="1">Pedido</option>
                        <option value="2">Despachado</option>
                        <option value="3">Pagado</option>
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
            </div>
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
                            <td>{pedido.clienteResponse.nombre}</td>
                            <td>{pedido.mesaId}</td>
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
    );
}

export default PedidoMesa;
