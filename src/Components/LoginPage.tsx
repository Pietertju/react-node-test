import React, { Component } from "react";
import "../Styles/LoginPage.scss"

interface State {
    loginName: string;
    loginPassword: string;
}

interface LoginPageProps {
    login: any;
    logout: any;
    LoggedIn: Boolean
    User: ProfileData
}

class LoginPage extends Component<LoginPageProps, State> {   

    constructor(props: LoginPageProps) {
        super(props);

        this.state = {
           loginName: "",
           loginPassword: ""
        }
    }

    submitLogin = () => {
        this.props.login(this.state.loginName, this.state.loginPassword)
    }

    handleChange = (field: string) => (event: any) => {
        this.setState({ [field]: event.target.value } as Pick<State, any>);
    }

    render() {
        return(
            <div className="loginPage">
                <div className="loginPageForm">
                    <form onSubmit={(e: any) => {e.preventDefault(); this.submitLogin();}}>
                        <label>Username</label>
                        <input type="text" id="uname" name="firstname" placeholder="Your name.." onChange={this.handleChange('loginName')}/>

                        <label>Password</label>
                        <input type="password" id="pword" name="lastname" onChange={this.handleChange('loginPassword')}/>

                        <input className={"loginButton"} type="submit" value="Login"/>
                    </form>
                    <input className={"logoutButton"} type="submit" onClick={() => {alert(":D"); this.props.logout()}} value="Logout"/>

                </div>

                
            </div>
        )
    }
}

export default LoginPage;