import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

export default function Navbar({ children }: { children: any }) {
  const menuRef = useRef<HTMLIonMenuElement>(null);

  return (
    <>
      <IonMenu ref={menuRef} contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menú</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className='navbar-container'>
            <div className="ion-padding">
              <ul className='navbar'>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/home'>Home</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/agendar-cita'>Clientes</Link>
                </li>
                <li style={{ listStyleType: 'none' }}>
                  <Link onClick={() => menuRef.current?.close()} to='/'>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {children}
        </IonContent>
      </IonPage>
    </>
  )
}
