import { IonButton, IonIcon, IonicSafeString, IonItem, IonList, IonRow, IonSelect, IonSelectOption, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { checkmarkDoneOutline, closeCircleOutline } from 'ionicons/icons';
import { collection, doc, limit, onSnapshot, orderBy, query, setDoc, where, } from 'firebase/firestore';
import { db } from '../firebase';
import user from '../lib/user'

enum ESTADOS {
  pendiente,
  cancelado,
  atendido
}
let unsubscribe: any

export default function Citas() {
  const [present] = useIonToast();
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [estado, setEstado] = useState(ESTADOS.pendiente)

  useEffect(() => {
    if (unsubscribe != null) unsubscribe()
    if (estado === ESTADOS.pendiente) {
      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("idMedico", "==", user.uid), where("atendida", "==", false), where("cancelado", "==", false), orderBy("fecha"), limit(40));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        setCitas(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Cita)))
        setLoading(false)
      })
    }
    if (estado === ESTADOS.atendido) {
      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("idMedico", "==", user.uid), where("atendida", "==", true), where("cancelado", "==", false), orderBy("fecha"), limit(40));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        setCitas(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Cita)))
        setLoading(false)
      })
    }
    if (estado === ESTADOS.cancelado) {
      const citasRef = collection(db, "citas");
      const q = query(citasRef, where("idMedico", "==", user.uid), where("cancelado", "==", true), orderBy("fecha"), limit(40));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        setCitas(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Cita)))
        setLoading(false)
      })
    }
  }, [estado])

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
      <IonList>
        <IonItem>
          <IonSelect onIonChange={(e) => {
            if (e.target.value === ESTADOS.pendiente) setEstado(ESTADOS.pendiente)
            if (e.target.value === ESTADOS.atendido) setEstado(ESTADOS.atendido)
            if (e.target.value === ESTADOS.cancelado) setEstado(ESTADOS.cancelado)
          }
          } interface="popover" placeholder="Pendientes">
            <IonSelectOption value={ESTADOS.pendiente}>Pendientes</IonSelectOption>
            <IonSelectOption value={ESTADOS.atendido}>Atendidas</IonSelectOption>
            <IonSelectOption value={ESTADOS.cancelado}>Canceladas</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
      <div style={{height: '20px'}}></div>
      {
        loading ? <IonSpinner></IonSpinner>
          :
          <div>
            {citas.map((cita, index) => {
              const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
              const dias_semana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
              const fecha: Date = cita.fecha.toDate();
              const fechaFormateada = dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear();
              let horasFormateadas = fecha.getHours() + ':' + fecha.getMinutes()
              if (fecha.getMinutes().toString.length === 1) horasFormateadas += '0'
              return <div key={index} style={{
                alignItems: 'center',
                backgroundColor: '#f7f7f7',
                color: 'black',
                borderColor: '#dedede',
                border: '1px solid',
                borderRadius: '5px',
                padding: '0 1rem',
                marginBottom: '1rem',
                paddingBottom: '1rem',
                textAlign: 'center',
                fontSize: '1.2rem'
              }}>
                <div>
                  <p>
                    <b>Cita con el paciente:</b> {cita.nombrePaciente}
                  </p>
                  <img src={cita.fotoPaciente} alt="foto paciente" style={{borderRadius: '10px'}} />
                  <p>
                    <b>Fecha:</b> {fechaFormateada} a las {horasFormateadas}
                  </p>
                </div>
                <div>
                  {!(cita.atendida || cita.cancelado) &&
                    <div>
                      <IonButton onClick={() => {
                        setDoc(doc(db, "citas", cita.id), {
                          ...cita,
                          atendida: true
                        });
                      }} color='success'>
                        <IonIcon icon={checkmarkDoneOutline}></IonIcon>
                      </IonButton>
                      <IonButton onClick={() => {
                        setDoc(doc(db, "citas", cita.id), {
                          ...cita,
                          cancelado: true
                        });
                      }} color='danger'>
                        <IonIcon icon={closeCircleOutline}></IonIcon>
                      </IonButton>
                    </div>
                  }
                </div>
              </div>
            }
            )
            }
          </div>
      }
    </div>
  )
}

