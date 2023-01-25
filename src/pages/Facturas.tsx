import { IonButton, IonCol, IonIcon, IonicSafeString, IonItem, IonList, IonRow, IonSelect, IonSelectOption, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react"
import { chevronDownOutline, chevronUpOutline, closeCircleOutline } from 'ionicons/icons';

export default function Facturas() {
  const [present] = useIonToast();
  const [facturas, setFacturas] = useState<Factura[]>()
  const [isShowingCanceled, setIsShowingCanceled] = useState(false)

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

  const cancelInvoice = async (invoiceId: number) => {
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/cancel/${invoiceId}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    presentToast('Factura anulada con éxito.', true)
    setFacturas(prev => prev?.filter((factura) => factura.id !== invoiceId))
  }

  const fetchIssuedInvoices = async () => {
    setFacturas(undefined)
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/findAll/issued/${'user.id'}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Factura[];
    setIsShowingCanceled(false)
    setFacturas(response)
  }

  const fetchCanceledInvoices = async () => {
    setFacturas(undefined)
    const responseData = await fetch(`${process.env.REACT_APP_API_URL}/factura/findAll/cancel/${'user.id'}`)
    if (!responseData.ok) {
      const response = await responseData.text();
      return presentToast(response, false)
    }
    const response = await responseData.json() as Factura[];
    setIsShowingCanceled(true)
    setFacturas(response)
  }

  useEffect(() => {
    fetchIssuedInvoices()
  }, [])

  return (
    <div className="ion-padding">
      <IonList>
        <IonItem>
          <IonSelect onIonChange={(e) => {
            if (e.target.value === 'issued') fetchIssuedInvoices()
            else fetchCanceledInvoices()
          }
          } interface="popover" placeholder="Emitidas">
            <IonSelectOption value="issued">Emitidas</IonSelectOption>
            <IonSelectOption value="canceled">Anuladas</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
      {
        facturas == null ? <IonSpinner></IonSpinner>
          :
          <div>
            {
              facturas.map((factura, index) => <ItemFactura
                factura={factura}
                cancelInvoice={cancelInvoice}
                isShowingCanceled={isShowingCanceled}
                key={index} />)
            }
          </div>
      }
    </div>
  )
}

function ItemFactura({ factura, isShowingCanceled, cancelInvoice }:
  { factura: Factura, isShowingCanceled: boolean, cancelInvoice: (id: number) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return <div style={{

    backgroundColor: '#f7f7f7',
    color: 'black',
    borderColor: '#dedede',
    border: '1px solid',
    borderRadius: '5px',
    padding: '0 1rem',
    marginBottom: '1rem'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '60%' }}>
        <p>
          Factura: {factura.id}
        </p>
        <p>
          Fecha: {factura.fechaDeEmision}
        </p>
      </div>
      <div>
        {!isShowingCanceled &&
          <IonButton onClick={() => cancelInvoice(factura.id)} color='danger'>
            <IonIcon icon={closeCircleOutline}></IonIcon>
            Anular
          </IonButton>}
      </div>
    </div>
    <div>
      <div style={{ marginLeft: '45%', marginTop: '-5%' }}>{
        isOpen ?
          <IonIcon onClick={() => setIsOpen(false)} size="large" icon={chevronUpOutline}></IonIcon> :
          <IonIcon onClick={() => setIsOpen(true)} size="large" icon={chevronDownOutline}></IonIcon>}
      </div>
      {
        isOpen &&
        <div>
          <p>Cédula: {factura.cliente?.identificacionNumero}</p>
          <p>Nombre: {factura.cliente?.nombre}</p>
          <p>Dirección: {factura.cliente?.direccion}</p>
          <p>Teléfono: {factura.cliente?.telefono}</p>
          <p>Email: {factura.cliente?.correoElectronico}</p>
          <p>Detalles:</p>
          <div>
            <IonRow className='row header'>
              <IonCol className='col'>Servicio</IonCol>
              <IonCol className='col'>Cantidad</IonCol>
              <IonCol className='col'>Total</IonCol>
            </IonRow>
            {factura.detalles.map(
              (detail) =>
                <IonRow className='row'>
                  <IonCol className='col'>{detail.servicio?.descripcion}</IonCol>
                  <IonCol className='col'>{detail.cantidad}</IonCol>
                  <IonCol className='col'>${detail.total.toFixed(2)}</IonCol>
                </IonRow>)}
          </div>
          <p>Subtotal: ${factura.subtotal.toFixed(2)}</p>
          <p>Iva: ${factura.impuesto.toFixed(2)}</p>
          <p>
            Total: ${factura.total.toFixed(2)}
          </p>
        </div>
      }
    </div>
  </div>
}


