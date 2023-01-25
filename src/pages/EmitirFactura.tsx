import { InputChangeEventDetail, IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonicSafeString, IonImg, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { addCircle, addCircleOutline, addOutline, createOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import './EmitirFactura.css'
import RegistrarCliente from './RegistrarCliente';

export default function EmitirFactura() {
  const {
    handleSubmit,
  } = useForm();
  const history = useHistory()
  const [client, setClient] = useState<Cliente>()
  const [details, setDetails] = useState<DetalleFactura[]>([])
  const [services, setServices] = useState<Servicio[]>([])
  const [isCreatingCliente, setIsCreatingCliente] = useState<boolean>(false)

  const inputClientRef = useRef<HTMLIonInputElement>(null)

  const [present] = useIonToast();

  const fetchServices = async () => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/servicio/findAll/${'user.id'}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Servicio[];
    setServices(response)
  }

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

  const searchClient = async (ci: string | number) => {
    const usuarioResponse = await fetch(`${process.env.REACT_APP_API_URL}/cliente/findByCedula/${ci}`)
    if (!usuarioResponse.ok) {
      const response = await usuarioResponse.text();
      setClient(undefined)
      return presentToast(response, false)
    }
    const response = await usuarioResponse.json() as Cliente;
    setClient(response)
  }

  const modal = useRef<HTMLIonModalElement>(null);
  const page = useRef(null);

  const [presentingElement, setPresentingElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPresentingElement(page.current);
    fetchServices()
  }, []);

  function dismiss() {
    modal.current?.dismiss();
  }

  const subtotal = details.reduce((prev, { total }) => prev + total, 0)
  const impuesto = subtotal * 0.12

  return (
    <IonPage>
      <div className="ion-padding">
        {
          isCreatingCliente ? <RegistrarCliente postSubmitAction={(client) => {
            setClient(client)
            setIsCreatingCliente(false)
          }} /> :
            <div style={{ minHeight: '800px' }}>
              <IonHeader collapse="condense">
                <IonToolbar>
                  <IonTitle size="large">Factura</IonTitle>
                </IonToolbar>
              </IonHeader>
              <form onSubmit={handleSubmit(async (data) => {
                const currentDate = new Date()
                const currentDateString = currentDate.toISOString().split('T')[0]
                const filteredDetails = details.filter(detail => detail.cantidad !== 0)
                const subtotal = filteredDetails.reduce(
                  (prev, { total }) => prev + total, 0)
                const impuesto = subtotal * 0.12
                const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/create`, {
                  body: JSON.stringify({
                    ...data,
                    usuarioId: 'user.id',
                    fechaDeEmision: currentDateString,
                    clienteId: client?.id,
                    subtotal,
                    impuesto,
                    total: subtotal + impuesto,
                    detalles: filteredDetails
                  }),
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
                presentToast(`Factura ${response.id} creada con éxito`, true)
                history.push("/facturas")
              })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <IonItem style={{ paddingRight: '1rem' }} lines="full">
                    <IonLabel position="floating">Cliente</IonLabel>
                    <IonInput ref={inputClientRef} type="text"></IonInput>
                  </IonItem>
                  <IonButton style={{ alignSelf: 'end' }} size="default" onClick={() =>
                    inputClientRef.current?.value && searchClient(inputClientRef.current.value)
                  } color="primary">
                    Buscar Cliente
                  </IonButton>
                </div>
                <IonRow>
                  <IonCol>
                    <IonButton onClick={() => setIsCreatingCliente(true)} type='button' color="primary" expand="block">Crear Cliente</IonButton>
                  </IonCol>
                </IonRow>
                <IonRow>
                  {client &&
                    <p style={{ fontSize: '1.1rem', paddingLeft: '1rem' }}>
                      Cliente: <span style={
                        {
                          backgroundColor: '#2cd36f',
                          borderRadius: '5px',
                          padding: '2px .6rem',
                          marginLeft: '.5rem',
                          color: 'white'
                        }
                      }>{client.nombre}</span>
                    </p>}
                </IonRow>
                <hr style={{ borderTop: '1px solid #e4e4e6' }} />
                <IonRow>
                  <IonCol>
                    <IonButton id="open-modal" color="primary" expand="block">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonIcon icon={addOutline}></IonIcon>
                        Agregar Servicio
                      </div>
                    </IonButton>
                  </IonCol>
                </IonRow>

                {details.length > 0 && <IonGrid>
                  <IonRow className='row header'>
                    <IonCol className='col'>Servicio</IonCol>
                    <IonCol className='col'>Cantidad</IonCol>
                    <IonCol className='col'>Total</IonCol>
                  </IonRow>
                  {details.map(
                    (detail) =>
                      <IonRow className='row'>
                        <IonCol className='col'>{services.find(service => service.id === detail.servicioId)?.descripcion}</IonCol>
                        <IonCol className='col'>
                          <input className='input' value={detail.cantidad} onInput={(e: any) => setDetails(
                            prevDetails => prevDetails.map(prevDetail => {
                              if (detail.servicioId === prevDetail.servicioId) {
                                return {
                                  ...prevDetail,
                                  cantidad: +e.target.value,
                                  total: +e.target.value * detail.precioUnitario
                                }
                              }
                              return prevDetail
                            })
                          )} type="text" required></input>
                        </IonCol>
                        <IonCol className='col'>${detail.total.toFixed(2)}</IonCol>
                      </IonRow>)
                  }
                </IonGrid>}

                <IonRow>
                  <IonCol>
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Iva: ${impuesto.toFixed(2)}</p>
                    <p>Total: ${(subtotal + impuesto).toFixed(2)}</p>
                  </IonCol>
                </IonRow>

                <IonRow>
                  <IonCol>
                    <IonButton type="submit" color="success" expand="block">Crear Factura</IonButton>
                  </IonCol>
                </IonRow>
              </form>
              <IonModal ref={modal} trigger="open-modal" presentingElement={presentingElement!}>
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Seleccionar Servicio</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => dismiss()}>Cerrar</IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  <IonList>
                    {services.map((service, i) =>
                      <IonItem key={i} onClick={() => {
                        const servicioEncontrado = details.find(detail => service.id === detail.servicioId)
                        if (servicioEncontrado) return presentToast('Este servicio ya fué agregado', false)
                        setDetails(prev => [...prev, {
                          cantidad: 1,
                          precioUnitario: service.precioUnitario,
                          total: service.precioUnitario,
                          servicioId: service.id
                        }])
                        dismiss()
                      }}>
                        <IonLabel>
                          <h2>{service.descripcion}</h2>
                          <p>${service.precioUnitario}</p>
                        </IonLabel>
                      </IonItem>)}
                  </IonList>
                </IonContent>
              </IonModal>
            </div>
        }
      </div>
    </IonPage>
  )
}



