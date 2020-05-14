import React from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";
import {menuTopBar} from "src/utils/helpers";


export default function TopBar() {
  const getSelectedKeys = () => {
    const path = window.location.pathname;
    if (path.startsWith("/admin")) {
      return ["/admin"];
    } else if (path.startsWith("/cinemas")) {
      return ["/cinemas"];
    } else if (path.startsWith("/films")) {
      return ["/films"];
    } else if (path.startsWith("/")) {
      return ["/"];
    }
  }

  const renderMenu = () => {
    return menuTopBar.map(({title, url}) => (
      <Menu.Item className="menu__item" key={url}>
        <Link to={url}>{title}</Link>
      </Menu.Item>
    ));
  }

  return (
    <>
      <div className="logo top-bar__logo">КиноПММ</div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={getSelectedKeys()}
        className="top-bar__menu menu"
      >
        {renderMenu()}
      </Menu>
    </>
  );
}
