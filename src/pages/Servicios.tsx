import { IonButton, IonCol, IonIcon, IonicSafeString, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { createOutline, trashOutline } from 'ionicons/icons';

export default function Servicios() {
  const [present] = useIonToast();
  const [services, setServices] = useState<Medico[]>()
  const [serviceEdited, setServiceEdited] = useState<Medico>()
  const [isCreatingService, setIsCreatingService] = useState<boolean>(false)

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

  const deleteClient = async (serviceId: string) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/delete/${serviceId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    presentToast('Servicio eliminado con éxito.', true)
    setServices(prev => prev?.filter((service) => service.imagen !== serviceId))
  }

  const fetchData = async () => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/findAll/${'user.id'}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Medico[];
    setServices(response)
  }

  const editService = (index: string) => {
    return (editedClient?: Medico) => {
      setServiceEdited(undefined)
      if (!editedClient) return
      setServices(prev => prev?.map(client => client.imagen === index ? editedClient : client))
    }
  }

  useEffect(() => {
    fetchData()
  }, [isCreatingService])

  return (
    <div className="ion-padding">
      <IonRow>
        <IonCol>
          <IonButton onClick={() => setIsCreatingService(true)} type="submit" color="primary" expand="block">Agregar Servicio</IonButton>
        </IonCol>
      </IonRow>
      {
        isCreatingService ? <div>registrar servicio</div> :
          services == null ? <IonSpinner></IonSpinner>
            :
            serviceEdited ? <div>registrar servicio</div> :
              <div>
                {services.map((service, index) =>
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
                        Servicio: {service.imagen}
                      </p>
                      <p>
                        Descripción: {service.imagen}
                      </p>
                    </div>
                    <div>
                      <IonButton onClick={() => setServiceEdited(service)} color='primary'>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                      <IonButton onClick={() => deleteClient(service.imagen)} color='danger'>
                        <IonIcon icon={trashOutline}></IonIcon>
                      </IonButton>
                    </div>
                  </div>)}
              </div>
      }
    </div>
  )
}

