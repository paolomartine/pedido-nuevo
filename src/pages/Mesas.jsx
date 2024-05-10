import React, { useState, useEffect } from 'react';
import './Mesas.css';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8085';

function Mesas() {
  const [mesas, setMesas] = useState([]);
  const navigate = useNavigate(); // Importa useNavigate

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mesas`);
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      const jsonData = await response.json();
      setMesas(jsonData);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleSeleccionarMesa = async (mesaId) => {
    try {
      // Cambiar la disponibilidad localmente
      const updatedMesas = mesas.map(mesa => {
        if (mesa.id === mesaId) {
          mesa.disponibilidad = !mesa.disponibilidad; // Cambia el estado de disponibilidad
        }
        return mesa;
      });
      setMesas(updatedMesas);

      // Actualizar la disponibilidad en la base de datos
      await fetch(`${API_BASE_URL}/api/v1/mesas/${mesaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ disponibilidad: !mesas.find(mesa => mesa.id === mesaId).disponibilidad })
      });

      // Redireccionar a la página de productos después de cambiar la disponibilidad
      navigate(`/productos?mesaId=${mesaId}&disponibilidad=${!mesas.find(mesa => mesa.id === mesaId).disponibilidad}`);
    } catch (error) {
      console.error('Error al actualizar la disponibilidad: ', error);
    }
  };

  return (
    <div>
      <div className="contenedor-mesas" style={{ backgroundColor: 'red', padding: '16px' }}>
        {mesas.length > 0 ? (
          mesas.map(mesa => (
            <div key={mesa.id} className={`mesa ${mesa.disponibilidad ? 'disponible' : 'no-disponible'}`}>
              <p>Estado: {mesa.disponibilidad ? 'Disponible' : 'No Disponible'}</p>
              <p>Mesa: {mesa.id}</p>
              {/* Botón de selección para cambiar la disponibilidad y redirigir a la página de productos */}
              <button onClick={() => handleSeleccionarMesa(mesa.id)}>Seleccionar Mesa</button>
            </div>
          ))
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div>
        <Link to="/productos">
          <button>Continuar</button>
        </Link>
      </div>
    </div>
  );
}

export default Mesas;
