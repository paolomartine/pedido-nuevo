import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const MesaForm = () => {
  const [mesa, setMesa] = useState({
    id: "",
    disponibilidad: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      // Cargar mesa existente si se proporciona un ID en los parámetros de la URL
      // Aquí puedes implementar la lógica para cargar los datos de la mesa desde el servidor
      // por ejemplo, haciendo una solicitud GET a `http://localhost:8085/api/v1/mesas/${params.id}`
    }
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8085/api/v1/mesas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mesa),
      });
      if (response.ok) {
        console.log("Los datos se han enviado correctamente al servidor.");
        setMesa({ id: "", disponibilidad: "" }); // Limpiar el formulario después de enviar los datos
        navigate("/"); // Redirigir a la página principal después de enviar los datos
      } else {
        throw new Error("Error al enviar los datos al servidor.");
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
      setError("Error al enviar los datos al servidor. Por favor, inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMesa({ ...mesa, [name]: value });
  };

  return (
    <Container maxWidth="md" className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <Typography variant="h4" align="center" gutterBottom>
          {params.id ? "Actualizar Mesa" : "Ingresar Mesa"}
        </Typography>
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <div className="mb-4">
          <input
            type="text"
            name="id"
            placeholder="ID de la mesa"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={mesa.id}
            autoFocus
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="disponibilidad"
            placeholder="Disponibilidad (true/false)"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={mesa.disponibilidad}
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Guardar"}
        </button>
      </form>
    </Container>
  );
};

export default MesaForm;
