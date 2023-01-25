import { IonButton, IonCol, IonContent, IonHeader, IonicSafeString, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';

export default function RegistrarServicio({ service, postSubmitAction }: { service?: Servicio, postSubmitAction: (editedservice?: Servicio) => void }) {
  const {
    register,
    handleSubmit,
  } = useForm();

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
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Servicio</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          if (!service) {
            const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/create`, {
              body: JSON.stringify({ ...data, usuarioId: 'user.id' }),
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
            })
            if (!responseData.ok) {
              const response = await responseData.text();
              return presentToast(response, false)
            }
            const response = await responseData.json() as Servicio;
            presentToast(`Servicio ${response.id} creado con éxito`, true)
            postSubmitAction(response)
          } else {
            const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/update`, {
              body: JSON.stringify({ ...data, id: service.id }),
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
            })
            if (!responseData.ok) {
              const response = await responseData.text();
              return presentToast(response, false)
            }
            const response = await responseData.json() as Servicio;
            presentToast(`Servicio ${response.id} actualizado con éxito`, true)
            postSubmitAction(response)
          }
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Descripción</IonLabel>
            <IonInput value={service ? service.descripcion : ''} {...register('descripcion')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Precio Unitario</IonLabel>
            <IonInput value={service ? service.precioUnitario : ''} {...register('precioUnitario')} step="any" type="number" required></IonInput>
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="primary" expand="block">{service ? 'Editar' : 'Crear'}</IonButton>
              <IonButton onClick={() => postSubmitAction(undefined)} color="danger" expand="block">Cancelar</IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  )
}

