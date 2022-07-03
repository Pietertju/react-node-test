import React, { Component } from "react";
import HeaderMenu from "./HeaderMenu";
import MainBody from "./MainBody";
import "../Styles/Main.scss"
import { AuthenticateClient, LoginModel, LoginResponse } from "../Client/HomeClient";
import { BrowserRouter, Navigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";


interface MainProps {
    
}

interface State {
    LoggedIn: Boolean
    User: ProfileData;
    shouldRedirect: Boolean;
    errorMessageList: String[],
}

class Main extends Component<MainProps, State> {
    //TODO check token on refresh for login
    constructor(props: MainProps) {
        super(props);

        this.state = {
            LoggedIn: false,
            User: {
                Username: "",
                Email: "",
                Id: "",
                Roles: ["", ""]
            } as ProfileData,
            shouldRedirect: false,
            errorMessageList: []
        }

        this.checkLoggedIn()
    }

    checkLoggedIn = () => {
        let client = new AuthenticateClient(process.env.REACT_APP_BACKEND_URL)
        client.isLogged().then(res => {
            this.setUserLogin(res)
        }).catch(err => {
            this.raiseException("Not logged in \n" + err)
        })
    }

    setUserLogin = (user: LoginResponse) => {
        let User: ProfileData = {
            Id: user.id as string,
            Username: user.username as string,
            Email: user.email as string,
            Roles: user.roles as string[]
        }

        this.setState({
            LoggedIn: true,
            User: User,
        })
    }

    login = (username: string, password: string) => {
        let client = new AuthenticateClient(process.env.REACT_APP_BACKEND_URL)
        let login = {
            username: username,
            password: password
        } as LoginModel
        client.login(login).then(res => {
            let token = res.token
            sessionStorage.setItem("userLoginToken", token as string)        
            this.setUserLogin(res)

            this.redirection()

        }).catch(err => {
            this.raiseException(err)
        })
    }

    redirection = () => {
        this.setState({
            shouldRedirect: true
        }, () => {
            this.setState({
                shouldRedirect: false
            })
        })
    }

    logout = () => {
        sessionStorage.clear();
        this.setState({
            LoggedIn: false,
            User: {
                Username: "",
                Email: "",
                Id: "",
                Roles: ["", ""]
            } as ProfileData
        })
    }

    raiseException = (message: string) => {
        let newErrorMessageList: String[] = this.state.errorMessageList;
        newErrorMessageList.push(message);
        this.setState({ errorMessageList: newErrorMessageList });
        console.log(message);
    }
    
    removeException = (index: number) => {
        let newErrorMessageList: String[] = this.state.errorMessageList;
        newErrorMessageList.splice(index, 1);
        this.setState({ errorMessageList: newErrorMessageList });
    }

    render() {
        return (
            <div className = {"application"}>
                <BrowserRouter>
                    <HeaderMenu LoggedIn={this.state.LoggedIn} User={this.state.User} />
                    <MainBody logout={() => this.logout()} LoggedIn={this.state.LoggedIn} User={this.state.User} login={(u: string, p: string) => this.login(u, p)} />                 
                    {this.state.shouldRedirect ? <Navigate to="/profile" /> : ""}
                </BrowserRouter>
                <div className="mt-4 databaseTable">
                    <ErrorMessage deleteCallback={this.removeException} errorList={this.state.errorMessageList}></ErrorMessage>
                </div>
            </div>
        );
    }   
}

export default Main