import { IonButton, IonCol, IonContent, IonHeader, IonicSafeString, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';

export default function RegistrarCliente({ client, postSubmitAction }: { client?: Cliente, postSubmitAction: (editedClient?: Cliente) => void }) {
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
            <IonTitle size="large">Cliente</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(async (data) => {
          if (!client) {
            const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/create`, {
              body: JSON.stringify(data),
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
            })
            if (!responseData.ok) {
              const response = await responseData.text();
              return presentToast(response, false)
            }
            const response = await responseData.json() as Cliente;
            presentToast(`Cliente ${response.nombre} creado con éxito`, true)
            postSubmitAction(response)
          } else {
            const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/update`, {
              body: JSON.stringify({ ...data, id: client.id }),
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
            })
            if (!responseData.ok) {
              const response = await responseData.text();
              return presentToast(response, false)
            }
            const response = await responseData.json() as Cliente;
            presentToast(`Cliente ${response.nombre} actualizado con éxito`, true)
            postSubmitAction(response)
          }
        })}>
          <IonItem lines="full">
            <IonLabel position="floating">Tipo de identificación</IonLabel>
            <IonSelect value={client ? client.tipoIdentificacion : ''} {...register('tipoIdentificacion')} placeholder="Tipo de identificación">
              <IonSelectOption value="CEDULA">Cédula</IonSelectOption>
              <IonSelectOption value="RUC">RUC</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Número de identificación</IonLabel>
            <IonInput value={client ? client.identificacionNumero : ''} {...register('identificacionNumero')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput value={client ? client.nombre : ''} {...register('nombre')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Dirección</IonLabel>
            <IonInput value={client ? client.direccion : ''} {...register('direccion')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Teléfono</IonLabel>
            <IonInput value={client ? client.telefono : ''} {...register('telefono')} type="text" required></IonInput>
          </IonItem>
          <IonItem lines="full">
            <IonLabel position="floating">Correo</IonLabel>
            <IonInput value={client ? client.correoElectronico : ''} {...register('correoElectronico')} type="email" required></IonInput>
          </IonItem>
          <IonRow>
            <IonCol>
              <IonButton type="submit" color="primary" expand="block">{client ? 'Editar' : 'Crear'}</IonButton>
              <IonButton onClick={() => postSubmitAction && postSubmitAction(undefined)} color="danger" expand="block">Cancelar</IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
    </IonPage>
  )
}
