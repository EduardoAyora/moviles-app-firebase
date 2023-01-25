import { IonButton, IonCol, IonIcon, IonicSafeString, IonRow, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { createOutline, trashOutline } from 'ionicons/icons';
import RegistrarCliente from "./RegistrarCliente";

export default function Clientes() {
  const [present] = useIonToast();
  const [clients, setClients] = useState<Cliente[]>()
  const [clientEdited, setClientEdited] = useState<Cliente>()
  const [isCreatingCliente, setIsCreatingCliente] = useState<boolean>(false)

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

  const deleteClient = async (clientId: number) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/delete/${clientId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    presentToast('Cliente eliminado con éxito.', true)
    setClients(prev => prev?.filter((cliente) => cliente.id !== clientId))
  }

  const fetchData = async () => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/cliente/findAll`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Cliente[];
    setClients(response)
  }

  const editClient = (index: number) => {
    return (editedClient?: Cliente) => {
      setClientEdited(undefined)
      if (!editedClient) return
      setClients(prev => prev?.map(client => client.id === index ? editedClient : client))
    }
  }

  useEffect(() => {
    fetchData()
  }, [isCreatingCliente])

  return (
    <div className="ion-padding">
      <IonRow>
        <IonCol>
          <IonButton onClick={() => setIsCreatingCliente(true)} type="submit" color="primary" expand="block">Agregar Cliente</IonButton>
        </IonCol>
      </IonRow>
      {
        isCreatingCliente ? <RegistrarCliente postSubmitAction={() => setIsCreatingCliente(false)} /> :
          clients == null ? <IonSpinner></IonSpinner>
            :
            clientEdited ? <RegistrarCliente client={clientEdited} postSubmitAction={editClient(clientEdited.id)} /> :
              <div>
                {clients.map((client, index) =>
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
                        Cliente: {client.identificacionNumero}
                      </p>
                      <p>
                        Nombre: {client.nombre}
                      </p>
                    </div>
                    <div>
                      <IonButton onClick={() => setClientEdited(client)} color='primary'>
                        <IonIcon icon={createOutline}></IonIcon>
                      </IonButton>
                      <IonButton onClick={() => deleteClient(client.id)} color='danger'>
                        <IonIcon icon={trashOutline}></IonIcon>
                      </IonButton>
                    </div>
                  </div>)}
              </div>
      }
    </div>
  )
}
