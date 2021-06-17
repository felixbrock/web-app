import React, { ReactElement } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import TopNav from './components/topnav/topnav';
import Subscriptions from './components/subscriptions/subscriptions';
import Systems from './components/systems/systems';
import DemoSystem from './components/demo-system/demo-system';
// import Footer from './components/footer/footer';
import './App.css';

export default (): ReactElement => (
  <div className="App">
    <Router>
      <div>
        <TopNav />
        <Switch>
          <Route exact component={Systems} path="/systems" />
          <Route exact component={Subscriptions} path="/automations" />
          <Route
            exact
            component={DemoSystem}
            path="/systems/6dad108e-21e9-4b68-8ba0-0b28ffd299bd"
          />
        </Switch>
        {/* <Footer /> */}
      </div>
    </Router>
  </div>
);
