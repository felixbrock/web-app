import React, { ReactElement } from 'react';
import './footer.css';

export default (): ReactElement => (
  <footer className="site-footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <h6>About</h6>
          <p className="text-justify">
            .
          </p>
        </div>
      </div>
      <hr />
    </div>
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-sm-6 col-xs-12">
          <p className="copyright-text">
            Copyright &copy; 2021 All Rights Reserved by &nbsp;
            <a href="#friction-frog">FrictionFrog</a>.
          </p>
        </div>
      </div>
    </div>
  </footer>
);
