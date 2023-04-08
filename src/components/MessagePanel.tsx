import React from 'react'
import { Peer, sendMessage } from 'connection'
import styles from './MessagePanel.module.scss'
import { Instructions } from './Instructions'

interface Props {
    peer?: Peer | null
    onSendMessage: () => void
    showInstructionsWithWelcome: boolean
}

export function MessagePanel({ peer, onSendMessage, showInstructionsWithWelcome }: Props) {
    const disabled = !peer || !peer.enabled
    const formRef = React.useRef<HTMLFormElement>(null)
    const [hasMessage, setHasMessage] = React.useState<boolean>()

    return (
        <div className={styles.container}>
            <div className={styles.messageContainer}>{peer ? renderMessages() : renderInstructions()}</div>
            <form ref={formRef} onSubmit={handleSendMessage} className={styles.form}>
                <textarea
                    name="message"
                    id="message"
                    placeholder={disabled ? 'Select a peer to message' : 'Enter message'}
                    draggable={false}
                    maxLength={5000}
                    disabled={disabled}
                    className={styles.textarea}
                    autoComplete="off"
                    onChange={v => setHasMessage(!!v.target.value)}
                />
                <button type="submit" disabled={disabled || !hasMessage} className={styles.sendButton}>
                    Send
                </button>
            </form>
        </div>
    )

    function renderMessages() {
        return (
            <div className={styles.messages}>
                {peer?.messages?.map((m, i) => (
                    <div key={i} className={m.sentOrReceived === 'sent' ? styles.sentMessage : styles.receivedMessage}>
                        <p className={styles.time}>{new Date(m.date).toLocaleTimeString()}</p>
                        <p className={styles.messageText}>{m.data}</p>
                    </div>
                ))}
            </div>
        )
    }

    function renderInstructions() {
        return (
            <div className={styles.instructions}>
                {showInstructionsWithWelcome && renderWelcomeMessage()}
                <Instructions />
            </div>
        )
    }

    function renderWelcomeMessage() {
        return (
            <div>
                <h2>Welcome to the P2P web messaging app</h2>
                <p>
                    This is a web app to faciliate messaging with peers via the WebRTC protocol. The app provides solely
                    an interface to send, receive and store messages. No information is stored or transmitted via third
                    parties. To achieve this:
                </p>
                <ul>
                    <li>The peer connections are established outside the app, completely up to the users</li>
                    <li>
                        The messages are stored in the peers' browser sessions and removed after the browser session is
                        terminated
                    </li>
                    <li>The app doesn't communicate or provide any information to internal or external parties</li>
                    <li>The app doesn't collect any metrics</li>
                </ul>
            </div>
        )
    }

    function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!peer) {
            return
        }

        const message: string = e.currentTarget.message.value
        sendMessage(peer, message, onSendMessage)
    }
}
