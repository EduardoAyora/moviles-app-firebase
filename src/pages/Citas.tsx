import { IonButton, IonIcon, IonicSafeString, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { createOutline, trashOutline } from 'ionicons/icons';
import { auth } from '../firebase';
import { collection, doc, getDoc, query, where, } from 'firebase/firestore';
import { db } from '../firebase';

export default function Citas() {
  const [present] = useIonToast();
  const [citas, setCitas] = useState<Cita[]>()
  const [user, setUser] = useState<Medico>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onIdTokenChanged(async () => {
      if (!auth.currentUser) return
      const citiesRef = collection(db, "medicos");
      const q = query(citiesRef, where("id", "==", auth.currentUser.uid));
      setLoading(false)
    })
  }, [])

  const presentToast = (
    message: string | IonicSafeString | undefined,
    success: boolean
  ) => {
    present({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: success ? 'success' : 'danger'
    });
  };

  return (
    <div className="ion-padding">
      {
        citas == null ? <IonSpinner></IonSpinner>
          :
          <div>
            {citas.map((service, index) =>
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f7f7f7',
                color: 'black',
                borderColor: '#dedede',
                border: '1px solid',
                borderRadius: '5px',
                padding: '0 1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ maxWidth: '60%' }}>
                  <p>
                    Servicio: {user?.nombre}
                  </p>
                  <p>
                    Descripción: {user?.nombre}
                  </p>
                </div>
                <div>
                  <IonButton onClick={() => { }} color='primary'>
                    <IonIcon icon={createOutline}></IonIcon>
                  </IonButton>
                  <IonButton onClick={() => { }} color='danger'>
                    <IonIcon icon={trashOutline}></IonIcon>
                  </IonButton>
                </div>
              </div>)}
          </div>
      }
    </div>
  )
}

