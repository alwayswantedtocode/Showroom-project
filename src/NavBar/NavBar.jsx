import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

import { useGlobalContext } from "../Global Conext/GlobalContext";
import { useAuthContext } from "../Global Conext/AuthenticationContext";
import SubMenu from "./SubMenu";
import "./Navbar.css";
import { FaBars, FaUserCircle } from "react-icons/fa";
import AccDropDown from "./AccDropDown";

const NavBar = () => {
  const {
    openMobileMenu,
    openSubMenu,
    isSubMenuOpen,
    showAside,
    setShowAside,
    AccountRef,
  } = useGlobalContext();
  const { user } = useAuthContext();
  //User uid from firebase
  const userId = user?.uid;

  //DISAPEARING NAVBAR
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const visibleNav = currentScrollPos < prevScrollPos;

    setPrevScrollPos(currentScrollPos);
    setVisible(visibleNav);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  //, visible

  //Mouseover buttons
  const displaySubMenu = (e) => {
    const brand = e.target.textContent;
    openSubMenu(brand);
  };

  // Account details drop down functions
  //Account functions
  const handleAccountIcon = () => {
    const clickOnIcon = showAside;

    if (clickOnIcon) {
      const iconElement = document.getElementById("user-icon");
      const iconRect = iconElement.getBoundingClientRect();

      const asideElement = document.getElementById("dropdown");
      const asideRect = asideElement.getBoundingClientRect();

      const center =
        (iconRect.left + iconRect.right) / 2.15 - asideRect.width / 2;

      const bottom = iconRect.bottom - asideRect.height;

      asideElement.style.left = `${center}px`;
      asideElement.style.bottom = `${bottom}px`;
    }
    setShowAside(clickOnIcon);
    setShowAside(!showAside);
  };

  // Click in anywhere to remove Account dropdown//
  const handleAccount = (event) => {
    if (!AccountRef.current.contains(event.target)) {
      setShowAside(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleAccount);

    return () => {
      document.removeEventListener("mousedown", handleAccount);
    };
  }, []);

  return (
    <header>
      <nav
        className="Nav"
        style={{ display: visible ? "flex" : "none" }}
        // onMouseOver={removeSubMenu}
      >
        <div className="NavContainer">
          <button className="toggle-Menubar" onClick={openMobileMenu}>
            <FaBars />
          </button>
          <div className="navLogo">
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>

          <div className="search-links-account-container">
            <div className=" navLinkContainer">
              <NavLink className="navLink mouseover" onClick={displaySubMenu}>
                Brands
              </NavLink>
              <NavLink className="navLink mouseover" to="/Dealers">
                Dealers
              </NavLink>
              <NavLink className="navLink mouseover" to="/Support">
                Support
              </NavLink>
            </div>

            {/* <button className="search-btn">
              <NavLink className="navLink mouseover">
                <FaSearch />
              </NavLink>
            </button> */}
          </div>
        </div>
        <div className="account-container" ref={AccountRef}>
          {userId ? (
            <div
              className="User-Icon"
              id="user-icon"
              onClick={handleAccountIcon}
            >
              {/* <img src="" alt="" /> */}
              <FaUserCircle />
            </div>
          ) : (
            <button className="signIn-btn">
              <NavLink to="/SignIn" className="navLink mouseover">
                Sign in
              </NavLink>
            </button>
          )}
        </div>

        <aside
          className={showAside ? "dropdownaside active" : "dropdownaside"}
          id="dropdown"
          ref={AccountRef}
        >
          <AccDropDown />
        </aside>

        {/* Dropdown brand menu */}
        <aside
          className={
            isSubMenuOpen
              ? "subMenuContainer active mouseover"
              : "subMenuContainer"
          }
        >
          <SubMenu className="mouseover" />
        </aside>
      </nav>
    </header>
  );
};

export default NavBar;
