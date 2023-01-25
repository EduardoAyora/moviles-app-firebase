import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCol, IonInput, IonItem, IonLabel, IonRow, useIonToast, IonicSafeString } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

import './Registro.css';

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
  } = useForm();

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
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, data.username, data.password)
            const userFirebase = userCredential.user;
            return history.push("/home")
          } catch (error: any) {
            return presentToast(error.message, false)
          }
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput {...register('username')} type="email" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput {...register('password')} type="password" required></IonInput>
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="danger" expand="block">Ingresar</IonButton>
            </IonCol>
          </IonRow>
        </form>
        <p style={{ marginLeft: '1rem' }}>
          ¿No tienes una cuenta?
          <Link to='/registro'> Regístrate</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Login;
