import styles from 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'
import { WelcomingModal } from './components/Modal'

export function App() {
    return (
        <div className={styles.container}>
            <WelcomingModal />
            <UserInterfaceView />
        </div>
    )
}
