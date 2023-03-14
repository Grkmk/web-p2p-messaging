import React, {useState, FormEvent, Component} from 'react'

export default class ModalForm extends Component <object, {username: string}> {

    public constructor(props: object) {
        super(props);
        this.state = {username: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    private handleChange(event: FormEvent) {
        this.setState({username: (event.target as HTMLTextAreaElement).value});
    }

    private handleSubmit(event: FormEvent) {
        sessionStorage.setItem("username", this.state.username);
        alert(sessionStorage.getItem("username"));
        event.preventDefault();
    }

    public render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Please enter a username:
                    <input type="text" value={this.state.username} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}