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
            .withUrl("https://pebbersapibackend.azurewebsites.net/chat", {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: () =>                       
                            (sessionStorage.getItem("userLoginToken") as string)
                })
            .configureLogging(signalR.LogLevel.Information)  
            .build();

        hubConnection.off("giveMessage")
        hubConnection.on("giveMessage", (m, u, t) => {
            let message = {
                Username: u,
                Message: m,
                Time: t
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
            //alert("_" + err)
        });  
    }

    // UNSAFE_componentWillReceiveProps(newProps: MainBodyProps) {
    //     if(newProps.LoggedIn) {
    //         this.createConnection()
    //     }
    // }

    componentWillUnmount () {
        if(this.state.hubConnected) {
            if(this.state.hubConnection) this.state.hubConnection.stop();
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
                <Route path="/" element={<h1>Main view: {this.props.LoggedIn ? "True" : "false"}</h1> }/>
                <Route path="/addform" element={<AddForm />}/>
                <Route path="/login" element={<LoginPage logout={() => {this.logout()}} LoggedIn={this.props.LoggedIn} User={this.props.User} login={(username: string, password: string) => {this.login(username, password)}}/> }/>
                <Route path="/profile" element={<ProfileMenu UsersConnected={this.state.UsersConnected} hubConnected={this.state.hubConnected} AddMessage={this.addMessage} Messages={this.state.Messages} LoggedIn={this.props.LoggedIn} User={this.props.User}/> }/>
            </Routes>  
        )
    }
}

export default MainBody;