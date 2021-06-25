import React, { ReactElement } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import TopNav from './components/top-nav/top-nav';
// import Subscriptions from './components/subscriptions/subscriptions';
// import Systems from './components/systems/systems';
// import DemoSystem from './components/demo-system/demo-system';
// import Footer from './components/footer/footer';
import './App.css';
import Systems from './pages/systems/systems';
import Selectors from './pages/selectors/selectors';
import Automations from './pages/automations/automations';
import Analytics from './pages/analytics/analytics';
import SignIn from './pages/sign-in/sign-in';
import Footer from './components/footer/footer';
import {
  HeaderContainer,
  ContentContainer,
  FooterContainer,
  App,
} from './App-Items';

export default (): ReactElement => (
  <div className="App">
    <App>
      <Router>
        <HeaderContainer>
          <TopNav />
        </HeaderContainer>
        <ContentContainer>
          <Switch>
            <Route path="/systems" component={Systems} />
            <Route path="/selectors" component={Selectors} />
            <Route path="/automations" component={Automations} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/sign-in" component={SignIn} />
          </Switch>
        </ContentContainer>
        <FooterContainer>
          <Footer />
        </FooterContainer>
      </Router>
    </App>
  </div>
);
