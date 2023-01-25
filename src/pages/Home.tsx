import './Home.css'
import { db } from '../firebase';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { doc, getDoc, } from 'firebase/firestore';
import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { reload } from 'ionicons/icons';
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<Medico>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onIdTokenChanged(async () => {
      if (!auth.currentUser) return
      const docRef = doc(db, "medicos", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data() as Medico)
      }
      setLoading(false)
    })
  }, [])

  return (
    <body className="welcome">
      <span id="splash-overlay" className="splash"></span>
      <span id="welcome" className="z-depth-4"></span>
      {loading || !user ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
        <IonIcon class="rotating" icon={reload} size='large' />
      </div> : <>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
          <img style={{ border: '2px solid black', borderRadius: '1rem' }} alt="foto de médico" src={user.imagen} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="fixed-action-btn">
          <p
            style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'black', textAlign: 'center', margin: '0.8rem 0' }}>
            Bienvenido {user.nombre}!
          </p>
        </div>
        <>

        </>
      </>}
    </body>
  )
}
