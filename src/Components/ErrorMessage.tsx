import React, { Component } from "react";
import Toast from "react-bootstrap/Toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle as farError } from '@fortawesome/free-solid-svg-icons';

interface ErrorProps {
    deleteCallback: any
    errorList: String[]
}

class ErrorMessage extends Component<ErrorProps> {

    render() {
        return (
            <div
                aria-live="polite"
                aria-atomic="true"
            >
                <div className={"errorMessageList"}>
                    {this.props.errorList.map((message, index) => {
                        return (
                            <Toast key={index} className={"errorMessage"} autohide={true} delay={5000} style={{maxWidth: '200px'}} onClose={() => this.props.deleteCallback(index)}>
                                <Toast.Header className={"errorMessageHeader"}>
                                    <FontAwesomeIcon className="mr-2" icon={farError} size='1x' />
                                    <strong className="mr-auto">Error</strong>
                                </Toast.Header>
                                <Toast.Body>{message}</Toast.Body>
                            </Toast>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default ErrorMessage;