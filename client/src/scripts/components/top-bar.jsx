import React from "react";
import { Menu, Badge } from "antd";
import { Link } from "react-router-dom";

const SubMenu = Menu.SubMenu;
const adminStyles = { padding: "0px 0px" };

export default class TopBar extends React.Component {
    getSelectedKeys() {
        const path = this.props.location.pathname;
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

    renderMenuItem(title, url) {
        return (
            <Menu.Item className="menu__item" key={url}>
                <Link to={url}>{title}</Link>
            </Menu.Item>
        );
    }
    render() {
        let menuItems = [];
        menuItems.push(this.renderMenuItem("Расписание", "/"));
        menuItems.push(this.renderMenuItem("Кинотеатры", "/cinemas"));
        menuItems.push(this.renderMenuItem("Фильмы", "/films"));
        menuItems.push(this.renderMenuItem("Админ", "/admin"));
        /*if (this.props.userData.isAdmin) {
            const subMenuItems = [this.renderMenuItem("Performance reviews", "/admin")];
            menuItems.push(
                <SubMenu key={"/admin"} className="menu__item" style={adminStyles} title={<span>Админ</span>}>
                    {subMenuItems}
                </SubMenu>
            );
        }*/
        return (
            <>
                <div className="logo top-bar__logo">КиноПММ</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={this.getSelectedKeys()}
                    className="top-bar__menu menu"
                >
                    {menuItems}
                </Menu>
            </>
        );
    }
}
