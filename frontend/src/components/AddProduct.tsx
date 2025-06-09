// Importación de React y sus hooks principales
import React, { useState, useEffect } from 'react';
// Axios para realizar peticiones HTTP al backend
import axios from 'axios';

// Interfaz que define un producto
interface Producto {
  id?: number; // ID opcional porque al añadir aún no existe
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// Props que recibe el componente AddProduct
interface AddProductProps {
  onProductoAñadido: () => void;       // Función callback que se ejecuta tras añadir/editar
  productoEditar: Producto | null;     // Producto a editar (si lo hay)
}

// Componente funcional para añadir o editar un producto
export default function AddProduct({ onProductoAñadido, productoEditar }: AddProductProps) {
  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Si se va a editar un producto, se rellenan los campos con sus datos
  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setDescripcion(productoEditar.descripcion);
      setPrecio(productoEditar.precio.toString());
      setStock(productoEditar.stock.toString());
    } else {
      // Si no hay producto seleccionado para editar, se limpian los campos
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    }
  }, [productoEditar]);

  // Maneja el envío del formulario, tanto para añadir como para editar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    const token = localStorage.getItem('token'); // Se obtiene el token para autenticación
    const producto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock)
    };

    // Envío de datos al backend
    try {
      if (productoEditar) {
        // Si hay producto para editar, se realiza un PUT
        await axios.put(`http://localhost:3001/productos/${productoEditar.id}`, producto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Si no, se realiza un POST para añadir un nuevo producto
        await axios.post('http://localhost:3001/productos', producto, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onProductoAñadido(); // Se actualiza la lista tras guardar
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    } catch {
      // No se usa el error (err), por eso se omite directamente
      alert('Error al guardar el producto');
    }
  };

  // Estructura visual del formulario
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
      <h2>{productoEditar ? 'Editar producto' : 'Añadir producto'}</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        type="number"
        placeholder="Precio"
        value={precio}
        onChange={e => setPrecio(e.target.value)}
        required
        min="0"
        step="0.01"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={e => setStock(e.target.value)}
        required
        min="0"
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: productoEditar ? '#facc15' : '#3b82f6', // Amarillo si edita, azul si añade
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        {productoEditar ? 'Guardar cambios' : 'Añadir'}
      </button>
    </form>
  );
}
