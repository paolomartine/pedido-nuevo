
const API_BASE_URL = 'http://localhost:8085'

export const useGetProductos = () => {

    const getMyProducto = async () => {

        const response = await fetch(`${API_BASE_URL}/api/v1/productos`, {
            method:'GET'
        })
       console.log('Respuesta', response);     
       return response.json();
    }

}