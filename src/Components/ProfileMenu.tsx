import React, { Component } from "react";

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
        let user = this.props.User
        return(
            <div className={"ProfileMenu"}>
                <h1>Hey</h1>
                <h2>Logged in is {this.props.LoggedIn ? "true" : "false"}</h2>
                <h3>Username: {user.Username}</h3>
                <h3>Id: {user.Id}</h3>
                <h3>Email: {user.Email}</h3>
                <h3>Roles: {user.Roles[0]}</h3>
            </div>
        )
    }
}

export default ProfileMenu;