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
            <div className={"chat"}>
                {this.props.Messages.map((m,k) => {
                    return <h3 key={k}>{m.Time} - {m.Username}: {m.Message}</h3>
                })}
            </div>
        )
    }
}

export default Chat