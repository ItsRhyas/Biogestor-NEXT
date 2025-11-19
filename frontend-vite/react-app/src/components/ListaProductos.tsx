import React, { useEffect } from "react";
import { obtenerProductos } from "../api/productos.api";

export function ListaProductos(): JSX.Element {
    useEffect(() => {
        async function cargarProductos() {
            const respuesta = await obtenerProductos();
            console.log(respuesta);
        }

        cargarProductos();
    }, []);

    return (
        <div>ListaProductos</div>
    );
}