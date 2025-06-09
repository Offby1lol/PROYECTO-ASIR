//Importación de react
import React from 'react';
//Importación de iconos para los botones (editar y eliminar)
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
//Interfaz que define la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}
//Props que recibe el componente 'ProductList'
interface ProductListProps {
  productos: Producto[];//Lista de productos a mostrar
  onEliminar: (id: number) => void;//Función para eliminar un producto
  onEditar: (producto: Producto) => void;//Función para seleccionar un producto a editar
  modoAdmin: boolean;//Booleano que indica si el usuario es administrador
}
//Componente que muestra la lista de productos
export default function ProductList({ productos, onEliminar, onEditar, modoAdmin }: ProductListProps) {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Productos</h1>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {productos.map(p => (
          <li key={p.id} style={{
            marginBottom: '16px', padding: '16px', border: '1px solid #ccc',
            borderRadius: '8px', backgroundColor: '#fff',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px'
          }}>
            {/*Información del producto*/}
            <div>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>{p.nombre}</h3>
              <p style={{ margin: '4px 0' }}>{p.descripcion}</p>
              <p style={{ margin: '4px 0' }}><strong>Precio:</strong> ${Number(p.precio).toFixed(2)}</p>
              <p style={{ margin: '4px 0' }}><strong>Stock:</strong> {p.stock}</p>
            </div>
            {/*Botones de editar y eliminar, visibles solo para el administrador*/}
            {modoAdmin && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => onEditar(p)} title="Editar producto" style={{
                  backgroundColor: '#facc15', color: '#000', border: 'none',
                  padding: '10px', borderRadius: '6px', cursor: 'pointer'
                }}>
                  <FaEdit />
                </button>
                <button onClick={() => onEliminar(p.id)} title="Eliminar producto" style={{
                  backgroundColor: '#e11d48', color: '#fff', border: 'none',
                  padding: '10px', borderRadius: '6px', cursor: 'pointer'
                }}>
                  <FaTrashAlt />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
