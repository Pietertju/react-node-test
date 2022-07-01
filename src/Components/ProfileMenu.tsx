import React, { Component } from "react";
import Test from "./Test";

interface State {
}

interface ProfileMenuProps {
    LoggedIn: Boolean
    User: ProfileData
}

class ProfileMenu extends Component<ProfileMenuProps, State> {   

    constructor(props: ProfileMenuProps) {
        super(props);

        this.state = {

        }   
    }



    render() {
        return(
            <div className={"ProfileMenu"}>
                <h1>Hey</h1>
                <h2>Logged in is {this.props.LoggedIn ? "true" : "false"}</h2>
                <h3>Username: {this.props.User.Username}</h3>
                <h3>Id: {this.props.User.Id}</h3>
                <h3>Email: {this.props.User.Email}</h3>
                <h3>Roles: {this.props.User.Username ? this.props.User.Roles.map((v) => {
                    return <span>{v}, </span>
                }) : ""}</h3>
                <div>
                    !{}!
                    <Test />
                </div>
            </div>
        )
    }
}

export default ProfileMenu;