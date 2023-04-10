import 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'
import { WelcomingModal } from './components/WelcomingModal'
import React, { useReducer } from 'react'

export const UserContext = React.createContext({ username: '' })

export function App() {
    const [username, setUsername] = React.useState('')
    const [update, forceUpdate] = useReducer(x => x + 1, 0)

    return (
        <UserContext.Provider value={{ username }}>
            <WelcomingModal key={update} onSetUsername={handlUsername} />
            <UserInterfaceView />
        </UserContext.Provider>
    )

    function handlUsername(username: string) {
        if (!username) {
            alert('Please enter a valid username')
            forceUpdate()
            return
        }

        sessionStorage.setItem('username', username)
        setUsername(username)
    }
}
