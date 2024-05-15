import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


function Clientes({ nombre, contacto, direccion }) {
    const [id, setId] = useState();
    const [clientesList, setClientesList] = useState([]);
    const [nombreCliente, setNombreCliente] = useState("");
    const [contactoCliente, setContactoCliente] = useState("");
    const [direccionCliente, setDireccionCliente] = useState("");
    const [editando, setEditando] = useState(false);
    const [clienteEditandoId, setClienteEditandoId] = useState(null);

    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerClientes = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/clientes");
            setClientesList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "nombre") {
            setNombreCliente(value);
        } else if (name === "contacto") {
            setContactoCliente(value);
        } else if (name === "direccion") {
            setDireccionCliente(value);
        }
    };

    const agregarCliente = () => {
        axios
            .post("http://localhost:8085/api/v1/clientes", {
                nombre: nombreCliente,
                contacto: contactoCliente,
                direccion: direccionCliente,
            })
            .then(() => {
                obtenerClientes();
                limpiarCampos();
                alert("Cliente agregado exitosamente");
            })
            .catch((error) => {
                console.error("Error al agregar cliente: ", error);
            });
    };

    const eliminarCliente = (cliente) => {

        MySwal.fire({
            title: "Estas seguro de eliminar?",
            html: "<i> <strong> Desea eliminar el cliente  " + cliente.nombre + " </i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`http://localhost:8085/api/v1/clientes/${cliente.id}`).then(() => {
                    obtenerClientes();
                    limpiarCampos();
                    MySwal.fire({
                        title: "Eliminado!",
                        text: cliente.nombre + "El cliente ha sido eliminado!",
                        icon: "success"
                    })
                });

            }
        });

    }

    const editarCliente = (cliente) => {
        setId(cliente.id);
        setEditando(true);
        setClienteEditandoId(cliente.id);
        setNombreCliente(cliente.nombre);
        setContactoCliente(cliente.contacto);
        setDireccionCliente(cliente.direccion);
    };

    const update = () => {
        axios.put("http://localhost:8085/api/v1/clientes", {
                id,
                nombre,
                contacto,
                direccion,
                 })
            .then(() => {
                obtenerClientes();
                MySwal.fire({
                    title: "<strong>Actualización exitosa!!!</strong> ",
                    html: "<i> <strong> El cliente  " + nombre + " fue actualizado con éxito! </i>",
                    icon: "success"
                });
                limpiarCampos();
            });
    };

    

    const limpiarCampos = () => {
        setNombreCliente("");
        setContactoCliente("");
        setDireccionCliente("");
        setClienteEditandoId(null);
    };

    return (
        <div className="container">
            <h1>Gestión de Clientes</h1>
            <div>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={nombreCliente}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="contacto"
                    placeholder="Contacto"
                    value={contactoCliente}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección"
                    value={direccionCliente}
                    onChange={handleChange}
                />
                {editando ? (
                    <Button onClick={update}>Actualizar Cliente</Button>
                ) : (
                    <Button onClick={agregarCliente}>Agregar Cliente</Button>
                )}
                <Button onClick={limpiarCampos}>Limpiar</Button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesList.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.contacto}</td>
                            <td>{cliente.direccion}</td>
                            <td>
                                <ButtonGroup>
                                <Button variant="secondary" onClick={() => editarCliente(cliente)}>Editar</Button>
                                    <Button onClick={() => {
                                        eliminarCliente(cliente)
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

export default Clientes;