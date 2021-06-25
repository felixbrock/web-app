import React, { ReactElement } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './nav-items';
import Logo from './hivedive.png';

export default (): ReactElement => (
      <Nav>
        <NavLink to='/systems'>
          <img src={Logo} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/systems'>
            Systems
          </NavLink>
          <NavLink to='/automations'>
            Automations
          </NavLink>
          <NavLink to='/analytics'>
            Analytics
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/sign-in'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
  );



