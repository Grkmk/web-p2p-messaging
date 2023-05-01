import React from 'react'
import { Peer, sendMessage } from 'connection'
import styles from './MessagePanel.module.scss'
import { Instructions } from './Instructions'
import { PaperPlaneIcon } from './icons/PaperPlaneIcon'

interface Props {
    peer?: Peer | null
    onSendMessage: () => void
    showInstructionsWithWelcome: boolean
}

/**
 * A functional component that renders the messaging interface for a given peer, including a form for sending messages and a container for displaying the message history.
 * @param {Object} props - The props object that contains the following properties:
 *   - peer {Object}                         - The peer object representing the connection.
 *   - onSendMessage {function}              - A callback function to be invoked when the user sends a message.
 *   - showInstructionsWithWelcome {boolean} - A flag indicating whether to show the welcome message and instructions.
 * @returns {JSX.Element} A React element representing the messaging interface component.
 * (Requirement 3.1.16, 3.2.2)
 */
export function MessagePanel({ peer, onSendMessage, showInstructionsWithWelcome }: Props) {
    const disabled = !peer || peer.conn.connectionState !== 'connected'
    const formRef = React.useRef<HTMLFormElement>(null)
    const [hasMessage, setHasMessage] = React.useState<boolean>()

    return (
        <div className={styles.container}>
            <div className={styles.messageContainer}>{peer ? renderMessages() : renderInstructions()}</div>
            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    name="message"
                    id="message"
                    placeholder={getPlaceholder()}
                    draggable={false}
                    maxLength={5000}
                    disabled={disabled}
                    className={styles.textarea}
                    autoComplete="off"
                    onChange={v => setHasMessage(!!v.target.value)}
                    // if enter is pressed, trigger submit
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
                            e.preventDefault()
                            formRef.current?.requestSubmit()
                        }
                    }}
                />
                <button type="submit" disabled={disabled || !hasMessage} className={styles.sendButton}>
                    <p>Send</p>
                    <PaperPlaneIcon />
                </button>
            </form>
        </div>
    )

    function getPlaceholder() {
        if (!peer) {
            return 'Select a peer to message'
        }

        if (peer.conn.connectionState !== 'connected') {
            return 'Peer is not active'
        }

        return 'Enter message'
    }

    /**
     * (Requirement 3.1.17)
     */
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

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!peer) {
            return
        }

        const message: string = e.currentTarget.message.value
        if (!message) {
            return
        }

        sendMessage(peer, message, onSendMessage)
        formRef.current?.reset()
    }
}
