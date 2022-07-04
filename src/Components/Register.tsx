import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticateClient, RegisterModel } from "../Client/HomeClient";
import "../Styles/Register.scss"

interface RegisterProps {
    raiseException: (message: string) => void;
    removeException: (index: number) => void;
}

interface State {
    inputName: string
    inputPassword: string
    inputEmail: string
    errorMessageList: String[],
    shouldRedirect: Boolean
}

class Register extends Component<RegisterProps, State> {

    constructor(props: RegisterProps) {
        super(props);

        this.state = {
            inputName: "",
            inputPassword: "",
            inputEmail: "",
            errorMessageList: [],
            shouldRedirect: false
        }
    }

    submitForm = async () => {
        let client = new AuthenticateClient(process.env.REACT_APP_BACKEND_URL);
        
        let user = {
            username: this.state.inputName,
            password: this.state.inputPassword,
            email: this.state.inputEmail
        } as RegisterModel
        client.registerUser(user).then(res => {
            this.props.raiseException(res.message as string)
            this.redirect();
        }).catch(err => {
            if(err.response) {
                var json = JSON.parse(err.response)
                if(json.errors.Username) this.props.raiseException(json.errors.Username[0])
                if(json.errors.Email) this.props.raiseException(json.errors.Email[0])
                if(json.errors.Password) this.props.raiseException(json.errors.Password[0])
            } else {
                if(err.message) this.props.raiseException(err.message)               
            }          
        })
    }

    redirect = () => {
        this.setState({
            shouldRedirect: true
        }, () => {
            this.setState({
                shouldRedirect: false
            })
        })       
    }

    handleChange = (field: string) => (event: any) => {
        this.setState({ [field]: event.target.value } as Pick<State, any>);
    }

    render() {
        return (
            <div>
                <div className="submissionForm">
                    <form onSubmit={(e: any) => {e.preventDefault(); this.submitForm();}}>
                        <label>Username</label>
                        <input type="text" id="uname" name="firstname" placeholder="Your name.." onChange={this.handleChange('inputName')}/>

                        <label>Password</label>
                        <input type="password" id="pword" name="lastname" onChange={this.handleChange('inputPassword')}/>

                        <label>Email</label>
                        <input type="text" id="email" name="firstname" placeholder="test@abc.com" onChange={this.handleChange('inputEmail')}/>

                        <input type="submit" value="Register"/>
                    </form>
                </div>
                {this.state.shouldRedirect ? <Navigate to="/login" /> : ""}
            </div>
            
        );
    }   
}

export default Register