import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { IUser, User, UserClient } from "../Client/HomeClient";
import { UserProperties } from "../Models/UserProperties";
import "../Styles/AddForm.scss"
import ErrorMessage from "./ErrorMessage"

interface AddFormProps {

}

interface State {
    UserList: UserProperties[]
    inputName: string
    inputPassword: string
    inputEmail: string
    errorMessageList: String[],
}

class AddForm extends Component<AddFormProps, State> {

    constructor(props: AddFormProps) {
        super(props);

        this.state = {
            UserList: [],
            inputName: "",
            inputPassword: "",
            inputEmail: "",
            errorMessageList: []
        }

        this.getUsers()
    }

    

    raiseException = (message: string) => {
        let newErrorMessageList: String[] = this.state.errorMessageList;
        newErrorMessageList.push(message);
        this.setState({ errorMessageList: newErrorMessageList });
        console.log(message);
    }
    
    removeException = (index: number) => {
        let newErrorMessageList: String[] = this.state.errorMessageList;
        newErrorMessageList.splice(index, 1);
        this.setState({ errorMessageList: newErrorMessageList });
    }

    setUserlist = (UserList: UserProperties[]) => {
        this.setState({
            UserList: UserList
        })
    }

    getUsers = () => {
        let client = new UserClient();
        client.getUsers().then(res => {
            if(res.userList) {
                let userList: UserProperties[] = new Array(res.userList.length);
                let index: number = 0;

                res.userList.forEach((element: User) => {
                    userList[index] = {
                        Id: element.id as number,
                        Username: element.username,
                        Password: element.password,
                        Email: element.email as string
                    }
                    index++;
                });
                this.setUserlist(userList)
            } else {
                alert("Nothing found")
            }
        }).catch(err => {
            alert(err.output)
        })
    }

    // hashIt = async (password: string) : Promise<string> => {
    //     const saltRounds = 10
        
    //     let hashedPassword = await new Promise((resolve, reject) => {
    //         bcrypt.hash(password, saltRounds, (err, res) => {
    //             if(err) reject(err)
    //             resolve(res)
    //         });
    //     })

    //     return hashedPassword as string
    // }

    submitForm = async () => {
        let client = new UserClient();
        
        let user = {
            id: 0,
            username: this.state.inputName,
            password: this.state.inputPassword,
            email: this.state.inputEmail
        } as IUser
        client.post(new User(user)).then(res => {
            this.raiseException(res.output as string)
            this.getUsers()
        }).catch(err => {
            this.raiseException(err.output)
            this.getUsers()
        })
    }

    deleteUser = (id: number) => {
        let client = new UserClient();
        
        client.delete(id).then(res => {
            if(res.output) {

            } else {
                this.raiseException(res as unknown as string)
            }
            this.getUsers()
        }).catch(err => {

            this.raiseException(err)
            this.getUsers()
        })
    } 

    handleChange = (field: string) => (event: any) => {
        this.setState({ [field]: event.target.value } as Pick<State, any>);
    }

    render() {
        return (
            <div>
                <Table striped bordered variant="dark" className ={"usertable"}>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>username</th>
                            <th>password</th>
                            <th>email</th>
                            <th>X</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.UserList.map((user, k) => {
                            return (
                                <tr key={k}>
                                    <td className="usertableData">{user.Id}</td>
                                    <td className="usertableData">{user.Username}</td>
                                    <td className="usertableData">{user.Password}</td>
                                    <td className="usertableData">{user.Email}</td>
                                    <td className={"usertableClose usertableData"} onClick={() => this.deleteUser(user.Id)}>X</td>
                                </tr>   
                            )
                        })}
                    </tbody>
                </Table>
                <div className="submissionForm">
                    <form onSubmit={(e: any) => {e.preventDefault(); this.submitForm();}}>
                        <label>Username</label>
                        <input type="text" id="uname" name="firstname" placeholder="Your name.." onChange={this.handleChange('inputName')}/>

                        <label>Password</label>
                        <input type="password" id="pword" name="lastname" onChange={this.handleChange('inputPassword')}/>

                        <label>Email</label>
                        <input type="text" id="email" name="firstname" placeholder="test@abc.com" onChange={this.handleChange('inputEmail')}/>

                        <input type="submit" value="Submit"/>
                    </form>
                </div>
                <div className="mt-4 databaseTable">
                    <ErrorMessage deleteCallback={this.removeException} errorList={this.state.errorMessageList}></ErrorMessage>
                </div>
                
            </div>
            
        );
    }   
}

export default AddForm