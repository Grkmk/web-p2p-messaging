import React, {useState, FormEvent, Component} from 'react'

interface Props {
    onSubmitUsername: (e: FormEvent, username: string) => void
}

export default function ModalContent(props: Props) {
    const [username, setUsername] = useState('')
    return (
        <div className="modalContent">
            <form onSubmit={e => props.onSubmitUsername(e, username)}>
                <label style={{color: 'white'}}>
                    Please enter a username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}