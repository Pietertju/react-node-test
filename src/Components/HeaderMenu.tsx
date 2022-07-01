import React, { Component } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

interface State {
   
}

interface HeaderMenuProps {
    LoggedIn: Boolean
    User: ProfileData
}

class HeaderMenu extends Component<HeaderMenuProps, State> {   

    constructor(props: HeaderMenuProps) {
        super(props);

        this.state = {
           
        }
    }

    render() {
        return(
            <div className={"Menu"}>
                <Nav fill variant="tabs" defaultActiveKey="home" as="ul">
                    <Nav.Item as="li">
                        <Nav.Link as={Link} to="/" eventKey="home">Mainpage</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link as={Link} to="/login" eventKey="login">Login</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link as={Link} to="/addform" eventKey="addform">AddForm</Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                        <Nav.Link as={Link} disabled={!this.props.LoggedIn as boolean} to="/profile" eventKey="profile">Profile</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        )
    }
}

export default HeaderMenu;