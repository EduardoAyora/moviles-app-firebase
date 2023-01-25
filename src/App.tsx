import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Registro from './pages/Registro';
import Login from './pages/Login';
import Home from './pages/Home'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './App.css';
import Navbar from './components/common/Navbar';
import AgendarCita from './pages/AgendarCita';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/registro">
          <Registro />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Navbar>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/agendar-cita">
            <AgendarCita />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Navbar>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
