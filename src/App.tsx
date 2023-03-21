import styles from 'App.module.scss'
import { WelcomingModal } from './components/Modal'

export function App() {
    return (
        <div className={styles.container}>
            <WelcomingModal />
        </div>
    )
}
