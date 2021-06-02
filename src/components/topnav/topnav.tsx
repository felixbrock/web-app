import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import NavItems from './nav-items';
import './topnav.css';
import Logo from './logo.png';

// class TopNav extends React.Component {
//   state = { clicked: false };

//   handleClick = (): void => {
//     this.setState({ clicked: !this.state.clicked });
//   };

//   render(): ReactElement {
//     return (
//       <nav className="topnav">
//         <img src={Logo} alt="logo" />
//         <div className="menu-icon" onClick={this.handleClick}>
//           <i
//             className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}
//            />
//         </div>
//         <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
//           {NavItems.map((item) => (
//             <li key={item.id}>
//               <a className={item.cName} href={item.url}>
//                 {item.title}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     );
//   }
// }

// export default TopNav;

export default (): ReactElement => (
  <nav className="topnav">
    <img src={Logo} alt="logo" />
    <ul className="nav-items">
      {NavItems.map((item) => (
        <Link className={item.cName} to={item.url}>
          <div className="nav-item-wrapper">
            <img className="nav-item-image" src={item.img} alt={item.title} />
          </div>
        </Link>
      ))}
    </ul>
  </nav>
  // <div className="topnav">
  // <img src={Logo} alt="logo" />
  //   <a className="active" href="http://localhost:3000/test">
  //     Systems
  //   </a>
  //   <a href="#subscriptions">Subscriptions</a>
  //   <a href="#about">About</a>
  // </div>
);
