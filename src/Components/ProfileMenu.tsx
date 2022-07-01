import React, { Component } from "react";
import { Message } from "../Models/Message";
import "../Styles/ProfileMenu.scss"
import Chat from "./Chat";

interface State {
    InputText: string
}

interface ProfileMenuProps {
    LoggedIn: Boolean
    User: ProfileData
    Messages: Message[]
    AddMessage: (message: string, admin: Boolean) => void
    hubConnected: Boolean
    UsersConnected: Number
}

class ProfileMenu extends Component<ProfileMenuProps, State> {   

    constructor(props: ProfileMenuProps) {
        super(props);

        this.state = {          
            InputText: ""
        }
    }


    sendMessage = () => {
        if(this.state.InputText.trim() !== "") {
            this.props.AddMessage(this.state.InputText, false)
            this.setState({
                InputText: ""
            })
        }
    }

    sendAdminMessage = () => {
        if(this.state.InputText.trim() !== "") {
            this.props.AddMessage(this.state.InputText, true)
            this.setState({
                InputText: ""
            })
        }
    }

    onChange = (evt: any)  => {
        this.setState({
            InputText: evt.target.value
        })
    }

    render() {
        return(
            <div className={"ProfileMenu"}>
                <h1>Hey</h1>
                <h2>Logged in is {this.props.LoggedIn ? "true" : "false"}</h2>
                <h3>Username: {this.props.User.Username}</h3>
                <h3>Id: {this.props.User.Id}</h3>
                <h3>Email: {this.props.User.Email}</h3>
                <h3>Roles: {this.props.User.Username ? this.props.User.Roles.map((v,k) => {
                    return <span key={k}>{v}, </span>
                }) : ""}</h3>
                <div className={"chatSection"}>
                    <h2>Connected: {this.props.hubConnected ? "True" : "False"} - - - - - - - - - Users connected: {this.props.UsersConnected.toString()}</h2>
                    {/* <input onClick={() => {this.addMessage()}} type="submit"/> */}
                    <Chat Messages={this.props.Messages}/>
                    <label>
                        <input value={this.state.InputText} onChange={(evt) =>  {this.onChange(evt)}} placeholder="Message" />
                    </label>
                    <input type="submit" onClick={() => this.sendMessage()} /><input type="submit" onClick={() => this.sendAdminMessage()} />
                </div>
            </div>
        )
    }
}

export default ProfileMenu;