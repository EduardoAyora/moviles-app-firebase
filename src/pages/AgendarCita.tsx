import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonCol, IonInput, IonItem, IonLabel, IonRow, useIonToast, IonicSafeString } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import './Registro.css';

const AgendarCita: React.FC = () => {
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
          <IonTitle>Agendar Cita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Agendar Cita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          const usuarioResponse = await fetch(`${process.env.REACT_APP_API_URL}/usuario/create`, {
            body: JSON.stringify(data),
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          if (!usuarioResponse.ok) {
            const response = await usuarioResponse.text();
            return presentToast(response, false)
          }
          const usuario = await usuarioResponse.json() as Usuario;
          presentToast(`Usuario ${usuario.username} creado con éxito`, true)
          return history.push("/login")
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput {...register('username')} type="email" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Contraseña</IonLabel>
            <IonInput {...register('password')} type="password" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Confirmar contraseña</IonLabel>
            <IonInput {...register('confirmPassword')} type="password" required></IonInput>
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="danger" expand="block">Registrarse</IonButton>
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

export default AgendarCita;
