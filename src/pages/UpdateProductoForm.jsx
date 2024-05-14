import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const UpdateProductoForm = () => {
  const [producto, setProducto] = useState({
    id: "",
    nombre: "",
    url: "",
    tiempoPreparacion: "",
    precio: "",
    ingredientes: "",
  });
  const [loading, setLoading] = useState(false);
  const [precioError, setPrecioError] = useState(false);
  const [tiempoPreparacionError, setTiempoPreparacionError] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const loadProducto = async () => {
      try {
        const res = await fetch(`http://localhost:8085/api/v1/productos/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await res.json();
        console.log('Producto cargado:', data); // Agregar registro de consola

        setProducto(data);
      } catch (error) {
        console.error('Error al cargar el producto:', error); // Agregar registro de consola
      }
    };

    if (params.id) {
      loadProducto();
    }
  }, [params.id]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8085/api/v1/productos/${id}`, {
        method: "DELETE",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8085/api/v1/productos/${params.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        }
      );
      await response.json();
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "precio") {
      setProducto((prevProducto) => ({
        ...prevProducto,
        [name]: value,
      }));
      if (isNaN(value) || parseFloat(value) <= 0) {
        setPrecioError(true);
      } else {
        setPrecioError(false);
      }
    } else if (name === "tiempoPreparacion") {
      setProducto((prevProducto) => ({
        ...prevProducto,
        [name]: value,
      }));
      if (isNaN(value) || parseFloat(value) <= 0) {
        setTiempoPreparacionError(true);
      } else {
        setTiempoPreparacionError(false);
      }
    } else {
      setProducto((prevProducto) => ({
        ...prevProducto,
        [name]: value,
      }));
    }
  };

  return (
    <Container maxWidth="md" className="flex justify-center items-center h-screen bg-blue-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <Typography variant="h4" align="center" gutterBottom>
          Actualizar Producto
        </Typography>

        <div className="mb-4">
          <input
            type="text"
            name="id"
            placeholder="ID del producto"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={producto.id}
            readOnly // El ID no debería ser editable
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={producto.nombre}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="url"
            placeholder="URL de la imagen"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={producto.url}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="tiempoPreparacion"
            placeholder="Tiempo de preparación"
            className={`border ${tiempoPreparacionError ? "border-red-500" : "border-gray-400"} p-2 rounded-md block w-full`}
            onChange={handleChange}
            value={producto.tiempoPreparacion}
          />
          {tiempoPreparacionError && (
            <Typography variant="caption" color="error">
              El tiempo de preparación debe ser un número mayor a 0.
            </Typography>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="precio"
            placeholder="Precio"
            className={`border ${precioError ? "border-red-500" : "border-gray-400"} p-2 rounded-md block w-full`}
            onChange={handleChange}
            value={producto.precio}
          />
          {precioError && (
            <Typography variant="caption" color="error">
              El precio debe ser un número mayor a 0.
            </Typography>
          )}
        </div>

        <div className="mb-4">
          <textarea
            name="ingredientes"
            rows={4}
            placeholder="Ingredientes"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={producto.ingredientes}
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={
              !producto.nombre ||
              !producto.tiempoPreparacion ||
              !producto.precio ||
              !producto.ingredientes ||
              !producto.url ||
              tiempoPreparacionError ||
              precioError
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Guardar"}
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={() => handleDelete(params.id)}
          >
            Eliminar
          </button>
        </div>
      </form>
    </Container>
  );
};

export default UpdateProductoForm;
