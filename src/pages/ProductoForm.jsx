import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    tiempoPreparacion: "",
    precio: "",
    ingredientes: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [precioError, setPrecioError] = useState(false);
  const [tiempoPreparacionError, setTiempoPreparacionError] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      loadProducto(params.id);
    }
  }, [params.id]);

  const loadProducto = async (id) => {
    const res = await fetch("http://localhost:8085/api/v1/productos/" + id);
    const data = await res.json();
    setProducto({
      nombre: data.nombre,
      tiempoPreparacion: data.tiempoPreparacion,
      precio: data.precio,
      ingredientes: data.ingredientes,
      url: data.url,
    });
  };

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
      if (params.id) {
        const response = await fetch(
          "http://localhost:8085/api/v1/productos/" + params.id,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
          }
        );
        await response.json();
      } else {
        const response = await fetch(
          "http://localhost:8085/api/v1/productos",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
          }
        );
        await response.json();
      }

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "precio") {
      setProducto({ ...producto, [name]: value });
      if (isNaN(value) || parseFloat(value) <= 0) {
        setPrecioError(true);
      } else {
        setPrecioError(false);
      }
    } else if (name === "tiempoPreparacion") {
      setProducto({ ...producto, [name]: value });
      if (isNaN(value) || parseFloat(value) <= 0) {
        setTiempoPreparacionError(true);
      } else {
        setTiempoPreparacionError(false);
      }
    } else {
      setProducto({ ...producto, [name]: value });
    }
  };

  return (
    <Container maxWidth="md" className="flex justify-center items-center h-screen bg-blue-100">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <Typography variant="h4" align="center" gutterBottom>
          {params.id ? "Actualizar Producto" : "Crear Producto"}
        </Typography>
        <div className="mb-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            className="border border-gray-400 p-2 rounded-md block w-full"
            onChange={handleChange}
            value={producto.nombre}
            autoFocus
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
          {params.id && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={() => handleDelete(params.id)}
            >
              Eliminar
            </button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default ProductoForm;
