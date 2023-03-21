import { Peer, sendMessage } from 'connection'
import styles from './MessagePanel.module.scss'

interface Props {
    peer: Peer
    onSendMessage: () => void
}

export function MessagePanel({ peer, onSendMessage }: Props) {
    return (
        <div className={styles.container}>
            {peer.messages?.map((m, i) => (
                <p key={i}>
                    {m.sentOrReceived} on {new Date(m.date).toLocaleString()}: {m.data}
                </p>
            ))}
            <form onSubmit={handleSendMessage(peer)}>
                <label>
                    Enter a message:
                    <input
                        type="text"
                        name="message"
                        id="message"
                        placeholder="Message text"
                        inputMode="text"
                        size={60}
                        maxLength={120}
                        disabled={!peer.enabled}
                    />
                </label>
                <button type="submit" disabled={!peer.enabled}>
                    Send
                </button>
            </form>
        </div>
    )

    function handleSendMessage(peer: Peer) {
        return (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const message: string = e.currentTarget.message.value
            sendMessage(peer, message, onSendMessage)
        }
    }
}
