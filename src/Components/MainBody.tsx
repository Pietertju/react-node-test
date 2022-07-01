import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AddForm from "./AddForm";
import LoginPage from "./LoginPage";
import "../Styles/MainBody.scss"
import ProfileMenu from "./ProfileMenu";

interface State {

}

interface MainBodyProps {
    LoggedIn: Boolean
    User: ProfileData
    login: (user: string, pass: string) => void
}

class MainBody extends Component<MainBodyProps, State> {   

    constructor(props: MainBodyProps) {
        super(props);

        this.state = {

        }
    }

    render() {
        return(
            <Routes>
                <Route path="/" element={<h1>Main view</h1> }/>
                <Route path="/addform" element={<AddForm />}/>
                <Route path="/login" element={<LoginPage LoggedIn={this.props.LoggedIn} User={this.props.User} login={this.props.login}/> }/>
                <Route path="/profile" element={<ProfileMenu LoggedIn={this.props.LoggedIn} User={this.props.User}/> }/>
            </Routes>  
        )
    }
}

export default MainBody;