import styles from 'App.module.scss'
import { UserInterfaceView } from 'views/UserInterfaceView'

export function App() {
    return (
        <div className={styles.container}>
            <UserInterfaceView />
        </div>
    )
}
