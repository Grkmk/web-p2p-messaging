import styles from 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'
import { WelcomingModal } from './components/WelcomingModal'

export function App() {
    return (
        <div className={styles.container}>
            <WelcomingModal />
            <UserInterfaceView />
        </div>
    )
}
