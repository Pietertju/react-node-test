import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AddForm from "./AddForm";
import LoginPage from "./LoginPage";
import "../Styles/MainBody.scss"
import ProfileMenu from "./ProfileMenu";
import { Message } from "../Models/Message";
import * as signalR from "@microsoft/signalr";

interface State {
    hubConnection: signalR.HubConnection
    hubConnected: Boolean
    Messages: Message[]
    UsersConnected: Number
}

interface MainBodyProps {
    LoggedIn: Boolean
    User: ProfileData
    login: (user: string, pass: string) => void
    logout: () => void
}

class MainBody extends Component<MainBodyProps, State> {   

    constructor(props: MainBodyProps) {
        super(props);

        this.state = {
            hubConnection: {} as signalR.HubConnection,
            hubConnected: false,
            Messages: [],
            UsersConnected: 0
        }

        if(this.props.LoggedIn) {
            this.createConnection()
        }
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

        hubConnection.on("setUsersConnected", (c) => {
            this.setState({
                UsersConnected: c
            })
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

    UNSAFE_componentWillReceiveProps(newProps: MainBodyProps) {
        if(newProps.LoggedIn) {
            this.createConnection()
        }
    }

    componentWillUnmount () {
        if(this.state.hubConnected) {
            this.state.hubConnection.stop();
        }
    }

    addMessage = (message: string, admin: Boolean) => {
        if(this.state.hubConnected) {
            if(admin) {
                this.state.hubConnection.invoke("sendAdminMessage", message)
            } else {
                this.state.hubConnection.invoke("sendUserMessage", message)
            }
        }
    }

    receiveMessage = (message: Message) => {
        this.setState((prevState) => ({
            Messages: [...prevState.Messages, message]
        }))
    }

    render() {
        return(
            <Routes>
                <Route path="/" element={<h1>Main view</h1> }/>
                <Route path="/addform" element={<AddForm />}/>
                <Route path="/login" element={<LoginPage logout={this.props.logout} LoggedIn={this.props.LoggedIn} User={this.props.User} login={this.props.login}/> }/>
                <Route path="/profile" element={<ProfileMenu UsersConnected={this.state.UsersConnected} hubConnected={this.state.hubConnected} AddMessage={this.addMessage} Messages={this.state.Messages} LoggedIn={this.props.LoggedIn} User={this.props.User}/> }/>
            </Routes>  
        )
    }
}

export default MainBody;