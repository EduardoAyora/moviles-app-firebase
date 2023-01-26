import './Home.css'
import { db, storage } from '../firebase';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { doc, getDoc, setDoc, } from 'firebase/firestore';
import { useState } from 'react';
import { IonButton, IonCol, IonIcon, IonicSafeString, IonInput, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import { reload } from 'ionicons/icons';
import userState from '../lib/user';
import { useForm } from 'react-hook-form';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export default function Home() {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [user, setUser] = useState<Medico>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onIdTokenChanged(async () => {
      if (!auth.currentUser) return
      userState.uid = auth.currentUser.uid
      fetchData()
    })
  }, [])

  async function fetchData() {
    const docRef = doc(db, "medicos", userState.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data() as Medico)
    }
    setLoading(false)
  }

  const [present] = useIonToast();
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
    <body className="welcome">
      <span id="splash-overlay" className="splash"></span>
      <span id="welcome" className="z-depth-4"></span>
      {loading || !user ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
        <IonIcon class="rotating" icon={reload} size='large' />
      </div> : <>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
          <img height={200} style={{ border: '2px solid black', borderRadius: '1rem' }} alt="foto de médico" src={user.imagen} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="fixed-action-btn">
          <p
            style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'black', textAlign: 'center', margin: '0.8rem 0' }}>
            Bienvenido {user.nombre}!
          </p>
        </div>
        <div style={{ overflowY: 'auto', height: '500px' }}>
          <form onSubmit={handleSubmit(async (data) => {
            setLoading(true)
            const file = data.file[0];
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            const urlImagen = await getDownloadURL(uploadTask.snapshot.ref)
            try {
              await setDoc(doc(db, "medicos", userState.uid), {
                nombre: data.name,
                imagen: urlImagen,
                direccion: data.direccion,
                especialidades: data.especialidades
              });
              await fetchData()
              setLoading(false)
              presentToast(`Usuario actualizado con éxito`, true)
            } catch (error: any) {
              setLoading(false)
              return presentToast(error.message, false)
            }
          })}>
            <IonItem lines="full">
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput value={user?.nombre} {...register('name')} type="text" required></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonLabel position="floating">Dirección</IonLabel>
              <IonInput value={user?.direccion} {...register('direccion')} type="text" required></IonInput>
            </IonItem>
            <IonItem lines="full">
              <IonLabel position="floating">Especialidades</IonLabel>
              <IonSelect value={user?.especialidades} multiple={true} {...register('especialidades')} placeholder="Especialidades">
                <IonSelectOption>Anestesiología</IonSelectOption>
                <IonSelectOption>Cardiología</IonSelectOption>
                <IonSelectOption>Endocrinología</IonSelectOption>
                <IonSelectOption>Geriatría</IonSelectOption>
                <IonSelectOption>Hematología</IonSelectOption>
                <IonSelectOption>Medicina interna</IonSelectOption>
                <IonSelectOption>Medicina preventiva</IonSelectOption>
                <IonSelectOption>Neumología</IonSelectOption>
                <IonSelectOption>Pediatría</IonSelectOption>
                <IonSelectOption>Neurología</IonSelectOption>
                <IonSelectOption>Psiquiatría</IonSelectOption>
                <IonSelectOption>Reumatología</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="full">
              <IonLabel position="stacked">Foto</IonLabel>
              <input {...register('file')} type='file' />
            </IonItem>
            <IonRow>
              <IonCol>
                <IonButton type="submit" color="danger" expand="block">
                  {loading ? <IonIcon class="rotating" icon={reload} /> : 'Actualizar Datos'}
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </div>
      </>}
    </body>
  )
}
