import 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'
import { WelcomingModal } from './components/WelcomingModal'
import React, { useReducer } from 'react'

export const UserContext = React.createContext({ username: '' })
const USERNAME_SESSION_KEY = 'p2p-messaging-username'

/**
 * The root component of the application.
 * It uses the `UserContext` to provide the `username` state to its child components.
 * If there is no username saved in session storage, it renders a `WelcomingModal` to prompt the user to enter a username.
 * Once a valid username is entered, it saves it in session storage and updates the `username` state.
 * @returns {JSX.Element} a React component that renders the application UI.
 */
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
