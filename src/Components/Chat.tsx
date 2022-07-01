import React from "react";
import { Component } from "react";
import { Message } from "../Models/Message";
import "../Styles/Chat.scss"

interface State {

}

interface ProfileMenuProps {
    Messages: Message[]
}

class Chat extends Component<ProfileMenuProps, State> {   

    constructor(props: ProfileMenuProps) {
        super(props);

        this.state = {

        }
    }


    render() {
        return (
            <div className={"Chat"}>
                {this.props.Messages.map((m,k) => {
                    return <h5 key={k}>{m.Time} - {m.Username}: {m.Message}</h5>
                })}
            </div>
        )
    }
}

export default Chat