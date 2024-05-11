import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8085';

function ClienteForm() {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCrearCliente = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, contacto, direccion })
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      console.log('Cliente creado exitosamente');
      setSuccessMessage('Cliente creado exitosamente');
      // Limpiar campos
      setNombre('');
      setContacto('');
      setDireccion('');

    } catch (error) {
      console.error('Error al crear el cliente:', error);
      setError('Hubo un error al crear el cliente. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalir = () => {
    // Aquí podrías agregar alguna lógica adicional antes de salir
    console.log('Saliendo...');
  };

  return (
    <div>
      <h2>Crear Cliente</h2>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <form onSubmit={handleCrearCliente}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contacto">Contacto:</label>
          <input
            type="text"
            id="contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          style={{ marginRight: '8px', marginTop: '16px' }}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Cliente"}
        </Button>
        <Link to="/menu">
        <Button 

        
          variant="contained"
          onClick={handleSalir}
          style={{ marginTop: '16px' }}
        >
          Salir
           
        </Button>
        </Link>
      </form>
    </div>
  );
}

export default ClienteForm;
