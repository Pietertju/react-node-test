import React from "react";
import { Component } from "react";
import "../Styles/Chats.scss"

interface State {

}

interface ChatsProps {
    UsersConnected: String[]
}

class Chats extends Component<ChatsProps, State> {   

    constructor(props: ChatsProps) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <div id={"Chat"} className={"Chat"}>
                {this.props.UsersConnected.map((m, k) => {
                    return <h5 key={k}>{m}</h5>
                })}
            </div>
        )
    }
}

export default Chats