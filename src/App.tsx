import 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'
import { WelcomingModal } from './components/WelcomingModal'
import React, { useReducer } from 'react'

export const UserContext = React.createContext({ username: '' })
const USERNAME_SESSION_KEY = 'p2p-messaging-username'

export function App() {
    const [username, setUsername] = React.useState(sessionStorage.getItem(USERNAME_SESSION_KEY) || '')
    const [update, forceUpdate] = useReducer(x => x + 1, 0)

    return (
        <UserContext.Provider value={{ username }}>
            {!username && <WelcomingModal key={update} onSetUsername={handlUsername} />}
            <UserInterfaceView />
        </UserContext.Provider>
    )

    function handlUsername(username: string) {
        if (!username) {
            alert('Please enter a valid username')
            forceUpdate()
            return
        }

        sessionStorage.setItem(USERNAME_SESSION_KEY, username)
        setUsername(username)
    }
}
