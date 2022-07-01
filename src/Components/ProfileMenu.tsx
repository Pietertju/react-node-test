import * as signalR from "@microsoft/signalr";
import React, { Component } from "react";
import { Message } from "../Models/Message";
import "../Styles/ProfileMenu.scss"
import Chat from "./Chat";

interface State {
    hubConnection: signalR.HubConnection
    hubConnected: Boolean
    Messages: Message[]
    InputText: string
}

interface ProfileMenuProps {
    LoggedIn: Boolean
    User: ProfileData
}

class ProfileMenu extends Component<ProfileMenuProps, State> {   

    constructor(props: ProfileMenuProps) {
        super(props);

        this.state = {
            hubConnection: {} as signalR.HubConnection,
            hubConnected: false,
            Messages: [],
            InputText: ""
        }

        this.createConnection()
    }

    createConnection = () => {
        if(this.state.hubConnected) return;
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44364/chat", {
            accessTokenFactory: () =>                       
                        (sessionStorage.getItem("userLoginToken") as string)
            })
            .configureLogging(signalR.LogLevel.Information)  
            .build();
 
        hubConnection.on("giveMessage", (m, u, t) => {
            let message = {
                Username: u,
                Message: m,
                Time: t
            } as Message
            this.receiveMessage(message)
        })

        hubConnection.on("backlogMessages", (m, u, t) => {
            let message = {
                Username: u,
                Message: m,
                Time: t
            } as Message
            this.receiveMessage(message)
        })

        hubConnection.on("setClientMessage", (m, t) => {
            let message = {
                Username: "",
                Message: m,
                Time: t
            } as Message
            this.receiveMessage(message)
        })

        // Starts the SignalR connection
        hubConnection.start().then(a => {          

            // Once started, invokes the onconnected in our ChatHub inside our ASP.NET Core application.              
            this.setState({
                hubConnected: true,
                hubConnection: hubConnection
            })

            hubConnection.invoke("getUserMessages")   
        }).catch(err => {
            alert(err)
        });  
    }

    componentWillUnmount () {
        if(this.state.hubConnected) {
            this.state.hubConnection.stop();
        }
    }

    addMessage = (message: string) => {
        if(this.state.hubConnected) {
            this.state.hubConnection.invoke("sendUserMessage", message)
        }
    }

    receiveMessage = (message: Message) => {
        this.setState((prevState) => ({
            Messages: [...prevState.Messages, message]
        }))
    }

    handleSubmit = () => {
        this.addMessage(this.state.InputText)
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
                <div>
                    !{}!
                    {/* <Test /> */}
                </div>

                <div className={"chatSection"}>
                    <h2>Connected: {this.state.hubConnected ? "True" : "False"}</h2>
                    {/* <input onClick={() => {this.addMessage()}} type="submit"/> */}
                    <Chat Messages={this.state.Messages}/>
                    <label>
                        <input value={this.state.InputText} onChange={(evt) =>  {this.onChange(evt)}} placeholder="Message" />
                    </label>
                    <input type="submit" onClick={() => this.handleSubmit()} />
                </div>
            </div>
        )
    }
}

export default ProfileMenu;