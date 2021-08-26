import React, { ReactElement } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';
import TopNav from './components/top-nav/top-nav';
// import Subscriptions from './components/subscriptions/subscriptions';
// import Systems from './components/systems/systems';
// import DemoSystem from './components/demo-system/demo-system';
// import Footer from './components/footer/footer';
import './App.css';
import Systems from './pages/systems/systems';
import Selectors from './pages/selectors/selectors';
import Automations from './pages/automations/automations';
import HistoricalData from './pages/historical-data/historical-data';
import Footer from './components/footer/footer';
import {
  HeaderContainer,
  ContentContainer,
  FooterContainer,
  App,
} from './App-Items';

export default (): ReactElement => {
  Amplify.configure({
    Auth: {
      region: 'eu-central-1',
      userPoolId: 'eu-central-1_dajdkLW0m',
      mandatorySignIn: true,
      userPoolWebClientId: '4lbatrkhi1q20f6us7ti8rqtfb',
      cookieStorage: {
        domain: 'localhost',
        path: '/',
        expires: 365,
        secure: true,
      },
    },
    oauth: {
      domain: 'hivedive.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'openid'],
      redirectSignIn: 'http://localhost:3006/systems',
      redirectSignOut: 'https://hivedive.io',
      responseType: 'token',
    },
  });

  return (
    <div className="App">
      <App>
        <Router>
          <HeaderContainer>
            <TopNav />
          </HeaderContainer>
          <ContentContainer>
            <Switch>
              <Route path="/systems" component={Systems} />
              <Route path="/system/:id" component={Selectors} />
              <Route path="/automations" component={Automations} />
              <Route path="/historical-data" component={HistoricalData} />
            </Switch>
          </ContentContainer>
          <FooterContainer>
            <Footer />
          </FooterContainer>
        </Router>
      </App>
    </div>
  );
};
