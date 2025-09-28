import axios from "axios";

export const obtenerProductos = () => {
    return axios.get("http://localhost:8000/productos/");
}