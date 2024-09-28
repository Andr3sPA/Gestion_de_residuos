'use client'

import React from "react";
import { useSession, signOut } from 'next-auth/react'; // Importa useSession y signOut
import Form from '../components/LoginForm';

export default function Home() {
  const { data: session } = useSession(); // Obtén la sesión

  return (
    <div>
      {session ? ( // Verifica si hay una sesión
        <>
          <p>Bienvenido, {session.user?.email}</p> {/* Muestra el email del usuario */}
          <button onClick={() => signOut()} style={{ marginTop: '10px' }}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <p>No has iniciado sesión.</p> // Mensaje si no hay sesión
      )}
      <Form />
    </div>
  );
}
