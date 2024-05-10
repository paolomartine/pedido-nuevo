
import React, { useEffect } from 'react';
//import { useState } from 'react';
import Layout from './Layout/Layout';


/* const API_BASE_URL = 'http://localhost:8085'

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()


  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/productos`)
      if (!response.ok) {
        throw new Error('Error en la solicitud')
      }
      const jsonData = await response.json()
      setData(jsonData)
      console.log(response)

    } catch (error) {
      console.error('Error: ', error)
    }

  }
  return (

    <div>
    {data.length > 0 ? (
      <div>
        {data.map(producto => (
          <div key={producto.id}>
            <p>Nombre: {producto.nombre}</p>
            <p>Tiempo de preparación: {producto.tiempoPreparacion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Ingredientes: {producto.ingredientes}</p>
          </div>
        ))}
      </div>
    ) : (
      <p>Cargando...</p>
    )}
  </div>
  )
}

export default App */

function App() {
  return (
    <>
      <Layout />
    </>

  )

}
export default App