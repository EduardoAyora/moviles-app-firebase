import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCol, IonInput, IonItem, IonLabel, IonRow, useIonToast, IonicSafeString, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from "firebase/firestore";
import { auth } from '../firebase';
import { db } from '../firebase';
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { reload } from 'ionicons/icons';

import './Registro.css';
import { useState } from 'react';

const Home: React.FC = () => {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory()

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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Registro</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          try {
            if (data.password !== data.confirmPassword)
              return presentToast('Las contraseñas no coinciden', false)
            setIsLoading(true)
            const userCredential = await createUserWithEmailAndPassword(auth, data.username, data.password)
            const user = userCredential.user;

            const file = data.file[0];
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            const urlImagen = await getDownloadURL(uploadTask.snapshot.ref)

            await setDoc(doc(db, "medicos", user.uid), {
              nombre: data.name,
              imagen: urlImagen
            });
            setIsLoading(false)
            presentToast(`Usuario ${user.email} creado con éxito`, true)
            return history.push("/login")
          } catch (error: any) {
            setIsLoading(false)
            return presentToast(error.message, false)
          }
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput {...register('username')} type="email" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput {...register('name')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput {...register('password')} type="password" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Confirmar contraseña</IonLabel>
            <IonInput {...register('confirmPassword')} type="password" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="stacked">Foto</IonLabel>
            <input {...register('file')} type='file' />
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="danger" expand="block">{isLoading ?
                <IonIcon class="rotating" icon={reload} /> :
                'Registrarse'}
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
        <p style={{ marginLeft: '1rem' }}>
          ¿Ya tienes una cuenta?
          <Link to='/login'> Inicia Sesión</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
