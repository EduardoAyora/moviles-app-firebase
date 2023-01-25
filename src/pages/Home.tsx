import './Home.css'
import { db } from '../firebase';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { doc, getDoc, } from 'firebase/firestore';
import { useState } from 'react';

export default function Home() {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    auth.onIdTokenChanged(async () => {
      if (!auth.currentUser) return
      const docRef = doc(db, "medicos", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNombre(docSnap.data().nombre)
      }
    })
  }, [])

  return (
    <body className="welcome">
      <span id="splash-overlay" className="splash"></span>
      <span id="welcome" className="z-depth-4"></span>

      <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="fixed-action-btn">
        <p
          style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'black', textAlign: 'center', margin: '0.8rem 0' }}>
          Bienvenido {nombre}!
        </p>
      </div>
    </body>
  )
}
