//Importación de React y hook de estado
import React, { useState } from 'react';
//Props que recibe el componente 'Login'
interface LoginProps {
  onLogin: () => void;//Función a ejecutar al iniciar sesión correctamente
}
//Componente que gestiona el inicio de sesión
export default function Login({ onLogin }: LoginProps) {
  //Estados para almacenar el correo y la contraseña del usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//Función que se ejecuta al enviar el formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();//Evita el comportamiento por defecto del formulario

    try {
      //Se hace una petición POST al backend con las credenciales
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      //Si las credenciales son incorrectas, se muestra un mensaje
      if (!res.ok) {
        alert('Credenciales incorrectas');
        return;
      }
      //Si la respuesta es correcta, se guarda el token (y el rol si se devuelve)
      const data = await res.json();

      localStorage.setItem('token', data.token);//Guarda el JWT
      localStorage.setItem('rol', data.rol); // Guarda el rol

      onLogin();//Se notifica al componente padre que el login fue exitoso
    } catch {
      //Si hay error al conectar con el backend
      alert('Error al conectar con el servidor');
    }
  };
  //JSX del formulario de inicio de sesión
  return (
    <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <button
        type="submit"
        style={{
          backgroundColor: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        Entrar
      </button>
    </form>
  );
}
