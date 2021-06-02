import React, { ReactElement } from 'react';
import './footer.css';

export default (): ReactElement => (
  <footer className="site-footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <h6>About</h6>
          <p className="text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dui
            massa, fermentum sed purus a, molestie egestas leo. Quisque
            fringilla velit nibh, et vestibulum nunc tincidunt quis. Nam
            efficitur luctus nisi sit amet varius.
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
