import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Table() {
    const [id, setId] = useState("");
    const [disponibilidad, setDisponibilidad] = useState(true);
    const [editar, setEditar] = useState(false);
    const [mesasList, setMesas] = useState([]);

    useEffect(() => {
        getMesas();
    }, []);

    const add = async () => {
        try {
            await axios.post("http://localhost:8085/api/v1/mesas", {
                id,
                disponibilidad
            });
            getMesas();
            limpiarCampos();
            MySwal.fire({
                title: "<strong>Registro exitoso!!!</strong>",
                html: `<i><strong> La mesa ${id} fue creada con éxito!</strong></i>`,
                icon: "success",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const update = async () => {
        try {
            console.log(id, disponibilidad)
            await axios.put("http://localhost:8085/api/v1/mesas", {
                id,
                disponibilidad,
            });
            getMesas();
            limpiarCampos();
            setEditar(false);
            MySwal.fire({
                title: "<strong>Actualización exitosa!!!</strong>",
                html: `<i><strong> La mesa #${id} fue actualizada con éxito!</strong></i>`,
                icon: "success",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const eliminar = async (mesa) => {
        const result = await MySwal.fire({
            title: "¿Estás seguro de eliminar?",
            html: `<i><strong>Desea eliminar la mesa #: ${mesa.id}</strong></i>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarla!",
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8085/api/v1/mesas/${mesa.id}`);
                getMesas();
                limpiarCampos();
                MySwal.fire({
                    title: "¡Eliminado!",
                    text: `La mesa #: ${mesa.id} ha sido eliminada!`,
                    icon: "success",
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const limpiarCampos = () => {
        setId("");
        setDisponibilidad(true);
        setEditar(false);
    };

    const editarMesa = (mesa) => {
        setEditar(true);
        setId(mesa.id);
        setDisponibilidad(mesa.disponibilidad);
    };

    const getMesas = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/mesas");
            setMesas(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Mesas</div>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">ID:</span>
                    <input
                        type="number"
                        name="id"
                        className="form-control"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Número de mesa"
                        aria-label="id"
                        aria-describedby="basic-addon1"
                    />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Disponibilidad:</span>
                    <select
                        name="disponibilidad"
                        className="form-control"
                        value={disponibilidad}
                        onChange={(e) => setDisponibilidad(e.target.value === 'true')}
                        aria-label="Disponibilidad"
                        aria-describedby="basic-addon1"
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>

                <div className="card-footer text-muted">
                    {editar ? (
                        <div>
                            <Button className="btn btn-primary" onClick={update}>Actualizar</Button>
                            <Button className="btn btn-info m-2" onClick={limpiarCampos}>Cancelar</Button>
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
                        <th scope="col">Disponibilidad</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mesasList.map((mesa) => (
                        <tr key={mesa.id}>
                            <th scope="row">{mesa.id}</th>
                            <td style={{ backgroundColor: mesa.disponibilidad ? 'lightgreen' : 'red' }}>
                                {mesa.disponibilidad ? 'Disponible' : 'Ocupada'}
                            </td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="btn btn-primary" onClick={() => editarMesa(mesa)}>Seleccionar</Button>
                                    <Button variant="danger" onClick={() => eliminar(mesa)}>Eliminar</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
