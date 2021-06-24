import React, { ReactElement } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import TopNav from './components/top-nav/top-nav';
// import Subscriptions from './components/subscriptions/subscriptions';
// import Systems from './components/systems/systems';
// import DemoSystem from './components/demo-system/demo-system';
// import Footer from './components/footer/footer';
import './App.css';
import Home from './pages';
import Systems from './pages/systems/systems';
import Selectors from './pages/selectors/selectors';
import Automations from './pages/automations/automations';
import Analytics from './pages/analytics/analytics';
import SignIn from './pages/sign-in/sign-in';

export default (): ReactElement => (
  <div className="App">
    <Router>
      <TopNav />
      <Switch>
        {/* <Route exact component={Systems} path="/systems" />
          <Route exact component={Subscriptions} path="/automations" />
          <Route
            exact
            component={DemoSystem}
            path="/systems/6dad108e-21e9-4b68-8ba0-0b28ffd299bd"
          /> */}
        <Route path="/" exact component={Home} />
        <Route path="/systems" component={Systems} />
        <Route path="/selectors" component={Selectors} />
        <Route path="/automations" component={Automations} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/sign-in" component={SignIn} />
      </Switch>
      {/* <Footer /> */}
    </Router>
  </div>
);
