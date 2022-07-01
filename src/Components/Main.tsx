import React, { Component } from "react";
import HeaderMenu from "./HeaderMenu";
import MainBody from "./MainBody";
import "../Styles/Main.scss"
import { AuthenticateClient, LoginModel } from "../Client/HomeClient";
import { BrowserRouter } from "react-router-dom";

interface MainProps {
    
}

interface State {
    LoggedIn: Boolean
    User: ProfileData;
}

class Main extends Component<MainProps, State> {
    //TODO check token on refresh for login
    constructor(props: MainProps) {
        super(props);

        this.state = {
            LoggedIn: false,
            User: {} as ProfileData
        }

        this.checkLoggedIn()
    }

    checkLoggedIn = () => {
        let client = new AuthenticateClient()
        client.isLogged().then(res => {
            this.setState({
                User: {
                    Id: res.id,
                    Username: res.username,
                    Email: res.email,
                    Roles: res.roles
                } as ProfileData,
                LoggedIn: true
            })
        }).catch(err => {
            alert("Not logged in")
        })
    }

    login = (username: string, password: string) => {
        let client = new AuthenticateClient()
        let login = {
            username: username,
            password: password
        } as LoginModel
        client.login(login).then(res => {
            let token = res.token
            sessionStorage.setItem("userLoginToken", token as string)        

            let User: ProfileData = {
                Id: res.id as string,
                Username: res.username as string,
                Email: res.email as string,
                Roles: res.roles as string[]
            }

            this.setState({
                LoggedIn: true,
                User: User
            })

        }).catch(err => {
            alert(err)
        })
    }

    render() {
        return (
            <div className = {"application"}>
                <BrowserRouter>
                    <HeaderMenu LoggedIn={this.state.LoggedIn} User={this.state.User} />
                    <MainBody LoggedIn={this.state.LoggedIn} User={this.state.User} login={this.login} />
                </BrowserRouter>
            </div>
        );
    }   
}

export default Main