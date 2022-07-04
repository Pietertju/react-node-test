import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import "../Styles/MainBody.scss"
import ProfileMenu from "./ProfileMenu";
import { Message } from "../Models/Message";
import * as signalR from "@microsoft/signalr";
import Register from "./Register";
import Chats from "./Chats";

interface State {
    hubConnection: signalR.HubConnection
    hubConnected: Boolean
    Messages: Message[]
    UsersConnected: String[]
}

interface MainBodyProps {
    LoggedIn: Boolean
    User: ProfileData
    login: (user: string, pass: string) => void
    logout: () => void
    raiseException: (message: string) => void;
    removeException: (index: number) => void;
}

class MainBody extends Component<MainBodyProps, State> {   

    constructor(props: MainBodyProps) {
        super(props);

        this.state = {
            hubConnection: {} as signalR.HubConnection,
            hubConnected: false,
            Messages: [],
            UsersConnected: []
        }
    }

    componentDidUpdate() {
        if(this.props.LoggedIn) {
            this.createConnection()
        }
    }

    logout = () => {
        this.props.logout()
        if(this.state.hubConnected) {
            if(this.state.hubConnection) this.state.hubConnection.stop();
            this.setState({
                hubConnected: false
            })
        }        
    }

    login = (username: string, password: string) => {
        this.props.login(username, password)
    }

    createConnection = (newProps?: string) => {
        if(this.state.hubConnected) return;

        this.setState({
            hubConnected: true
        })
        const hubConnection = new signalR.HubConnectionBuilder()
        // .withUrl("https://localhost:44364/chat", {
        //         skipNegotiation: true,
        //         transport: signalR.HttpTransportType.WebSockets,
        //         accessTokenFactory: () =>                       
        //                     (sessionStorage.getItem("userLoginToken") as string)
        //         })
        //     .configureLogging(signalR.LogLevel.Information)  
        //     .build();
            .withUrl("https://pebbersapibackend.azurewebsites.net/chat", {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () =>                       
                            (sessionStorage.getItem("userLoginToken") as string)
                })
            .configureLogging(signalR.LogLevel.Information)  
            .build();

        hubConnection.off("giveMessage")
        hubConnection.on("giveMessage", (user) => {
            let message = {
                Username: user.username,
                Message: user.message,
                Time: user.time
            } as Message
            this.receiveMessage(message)
        })

        hubConnection.off("backlogMessages")
        hubConnection.on("backlogMessages", (m, u, t) => {
            let message = {
                Username: u,
                Message: m,
                Time: t
            } as Message
            this.receiveMessage(message)
        })

        hubConnection.off("setClientMessage")
        hubConnection.on("setClientMessage", (m, t) => {
            let message = {
                Username: "",
                Message: m,
                Time: t
            } as Message
            this.receiveMessage(message)         
        })

        hubConnection.off("setUsersConnected")
        hubConnection.on("setUsersConnected", (c) => {
            console.log(c)
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

            if(this.state.Messages.length === 0) hubConnection.invoke("getUserMessages")   
        }).catch(err => {
            this.setState({
                hubConnected: false
            })
        });  
    }

    componentWillUnmount () {
        if(this.state.hubConnected) {
            if(this.state.hubConnection) this.state.hubConnection.stop();
        }
    }

    addMessage = async (message: string, admin: Boolean) => {
        if(this.state.hubConnected) {
            if(admin) {
                await this.state.hubConnection.invoke("sendAdminMessage", message)
            } else {
                await this.state.hubConnection.invoke("sendUserMessage", message)
            }
        }
    }

    receiveMessage = (message: Message) => {
        this.setState((prevState) => ({
            Messages: [...prevState.Messages, message]
        }), () => {
            var elem = document.getElementById('Chat');
            if(elem) elem.scrollTop = elem.scrollHeight
        })
    }

    render() {
        return(
            <Routes>
                <Route path="/" element={<h1>Logged in currently: {this.props.LoggedIn ? "True" : "false"}</h1> }/>
                <Route path="/register" element={<Register raiseException={this.props.raiseException} removeException={this.props.removeException}/>}/>
                <Route path="/login" element={<LoginPage logout={() => {this.logout()}} LoggedIn={this.props.LoggedIn} User={this.props.User} login={(username: string, password: string) => {this.login(username, password)}}/> }/>
                <Route path="/profile" element={<ProfileMenu UsersConnected={this.state.UsersConnected} hubConnected={this.state.hubConnected} AddMessage={this.addMessage} Messages={this.state.Messages} LoggedIn={this.props.LoggedIn} User={this.props.User}/> }/>
                <Route path="/chats" element={<Chats UsersConnected={this.state.UsersConnected} />} />
            </Routes>  
        )
    }
}

export default MainBody;