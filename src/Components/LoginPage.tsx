import React, { Component } from "react";
import "../Styles/LoginPage.scss"

interface State {
    loginName: string;
    loginPassword: string;
}

interface LoginPageProps {
    login: any;
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

    logout = () => {
        sessionStorage.clear();

        //set logout true
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
                        <input className={"logoutButton"} type="submit" onClick={(e) => {e.preventDefault(); this.logout();}} value="Logout"/>
                    </form>
                </div>

                
            </div>
        )
    }
}

export default LoginPage;