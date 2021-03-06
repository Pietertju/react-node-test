import React from "react";
import { Component } from "react";
import { Message } from "../Models/Message";
import "../Styles/Chat.scss"

interface State {

}

interface ChatProps {
    Messages: Message[]
}

class Chat extends Component<ChatProps, State> {   

    constructor(props: ChatProps) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        var elem = document.getElementById('Chat');
        if(elem) elem.scrollTop = elem.scrollHeight
    }

    render() {
        return (
            <div id={"Chat"} className={"Chat"}>
                {this.props.Messages.map((m,k) => {
                    return <h5 key={k}>{m.Time} - {m.Username}: {m.Message}</h5>
                })}
            </div>
        )
    }
}

export default Chat