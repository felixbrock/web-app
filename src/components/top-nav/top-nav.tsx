// import React, { ReactElement } from 'react';
// import { Link } from 'react-router-dom';
// import NavItems from './nav-items';
// import './top-nav.css';
// import Logo from './logo.png';

// // class TopNav extends React.Component {
// //   state = { clicked: false };

// //   handleClick = (): void => {
// //     this.setState({ clicked: !this.state.clicked });
// //   };

// //   render(): ReactElement {
// //     return (
// //       <nav className="top-nav">
// //         <img src={Logo} alt="logo" />
// //         <div className="menu-icon" onClick={this.handleClick}>
// //           <i
// //             className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}
// //            />
// //         </div>
// //         <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
// //           {NavItems.map((item) => (
// //             <li key={item.id}>
// //               <a className={item.cName} href={item.url}>
// //                 {item.title}
// //               </a>
// //             </li>
// //           ))}
// //         </ul>
// //       </nav>
// //     );
// //   }
// // }

// // export default TopNav;

// export default (): ReactElement => (
//   <nav className="top-nav">
//     <img src={Logo} alt="logo" />
//     <ul className="nav-items">
//       {NavItems.map((item) => (
//         <Link className={item.cName} to={item.url}>
//           <div className="nav-item-wrapper">
//             <img className="nav-item-image" src={item.img} alt={item.title} />
//           </div>
//         </Link>
//       ))}
//     </ul>
//   </nav>
//   // <div className="top-nav">
//   // <img src={Logo} alt="logo" />
//   //   <a className="active" href="http://localhost:3000/test">
//   //     Systems
//   //   </a>
//   //   <a href="#subscriptions">Subscriptions</a>
//   //   <a href="#about">About</a>
//   // </div>
// );

import React, { ReactElement } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './nav-items';
import Logo from './logo.png';
import './top-nav.css';

const activeStyle = {color: 'blue'};

export default (): ReactElement => (
    <>
      <Nav>
        <NavLink to='/'>
          <img className='logo' src={Logo} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/systems' activeStyle={activeStyle}>
            Systems
          </NavLink>
          <NavLink to='/automations' activeStyle={activeStyle}>
            Automations
          </NavLink>
          <NavLink to='/analytics' activeStyle={activeStyle}>
            Analytics
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/sign-in'>Sign In</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );



