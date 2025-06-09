//Importación de React y hooks necesarios
import React, { useEffect, useState } from 'react';
//Importación de axios para realizar peticiones HTTP
import axios from 'axios';
//Importación de componentes internos del frontend
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Login from './components/login';
//Interfaz que define la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

function App() {
  //Estados principales de la app
  const [productos, setProductos] = useState<Producto[]>([]);//Lista de productos
  const [modoAdmin, setModoAdmin] = useState<boolean>(false);//Si el usuario es admin
  const [logueado, setLogueado] = useState<boolean>(false);//Si hay sesión iniciada
  const [filtro, setFiltro] = useState('');                //Filtro para la búsqueda 
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);//Producto seleccionado para editar

  //Función que obtiene los productos del backend y actualiza el estado
  const cargarProductos = () => {
    axios.get('http://localhost:3001/productos')
      .then(res => setProductos(res.data.data))//Se actualiza el estado con la lista de productos
      .catch(err => console.error('Error al cargar productos:', err));
  };
//Función para eliminar un producto del backend usando su ID
  const eliminarProducto = (id: number) => {
    const token = localStorage.getItem('token');//Se obtiene el token guardado en localStorage
    axios.delete(`http://localhost:3001/productos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`//Se envía el token en la cabezera Authorization
      }
    })
      .then(() => cargarProductos()) //Si la eliminación tiene éxito, se recarga la lista
      .catch(err => console.error('Error al eliminar:', err));
  };

  //Función que maneja el inicio de sesión y determina si el usuario es admin o normal
  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));//Se decodifica el JWT para extraer el rol
      setModoAdmin(payload.role === 'admin'); //Se activa el modoAdmin si el rol es 'admin'
      setLogueado(true); //Se indica que hay sesión iniciada
      cargarProductos(); //Se cargan los productos al iniciar sesión
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
  };
    //Función que cierra la sesión del usuario
  const handleLogout = () => {
    localStorage.removeItem('token');//Se elimina el token
    setModoAdmin(false);
    setLogueado(false);
  };
    //Función que prepara un producto para ser editado
  const handleEditar = (producto: Producto) => {
    setProductoEditar(producto);//Se guarda el producto en el estado para pasarlo a AddProduct
  };
//Hook que se ejecuta al iniciar la aplicación y comprueba si ya hay un token válido
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) handleLogin();
  }, []);
//Se filtran los productos según el valor del input de búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );
//Estructura del componente principal
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      {!logueado ? (
        //Si no ha iniciado sesión, se muestra el formulario de login
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/*Botón para cerrar sesión*/}
          <button onClick={handleLogout} style={{
            backgroundColor: '#f87171', color: '#fff', border: 'none',
            padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', marginBottom: '15px',
          }}>Cerrar sesión</button>
          {/*Si el usuario es administrador, se muestra el formulario para añadir o editar productos*/}
          {modoAdmin && (
            <AddProduct
              onProductoAñadido={() => {
                cargarProductos();//Recarga productos al guardar
                setProductoEditar(null);//Limpia el estado de edición
              }}
              productoEditar={productoEditar}//Se pasa el producto seleccionado para editar
            />
          )}

          <hr style={{ margin: '30px 0' }} />
          {/*Campo de búsquda de productos*/}
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              width: '100%', padding: '10px', marginBottom: '20px',
              borderRadius: '6px', border: '1px solid #ccc'
            }}
          />
          {/*Lista de productos (filtrados), junto a las funciones de eliminar y editar*/}
          <ProductList
            productos={productosFiltrados}
            onEliminar={eliminarProducto}
            onEditar={handleEditar}
            modoAdmin={modoAdmin}
          />
        </>
      )}
    </div>
  );
}

export default App;
