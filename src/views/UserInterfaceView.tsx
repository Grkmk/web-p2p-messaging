import styles from './UserInterfaceView.module.scss'
import { useEffect, useReducer, useState } from 'react'
import { Peer } from 'connection'
import { MessagePanel } from 'components/MessagePanel'
import { AddConnectionsContainer } from 'components/AddConnectionsContainer'
import { Connections } from 'components/Connections'
import { Instructions } from 'components/Instructions'

const mockPeer: Peer = {
    id: 'asdf',
    username: 'mock user',
    conn: new RTCPeerConnection(),
    enabled: true,
}

export function UserInterfaceView() {
    const [peers] = useState<Record<string, Peer>>({ [mockPeer.id]: mockPeer })
    const [selectedPeer, setSelectedPeer] = useState<Peer | null>()
    const [showWelcome, setShowWelcome] = useState<boolean>(true)
    const [showInstructions, setShowInstructions] = useState<boolean>(false)
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    useEffect(() => {
        if (showWelcome && !!Object.keys(peers).length) {
            setShowWelcome(false)
        }
    }, [peers, showWelcome])

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                {renderAppInfo()}
                <Connections
                    peers={Object.values(peers)}
                    onSelectPeer={setSelectedPeer}
                    onRemovePeer={id => handleRemovePeer(id)}
                    getPeer={id => peers[id]}
                />
                <AddConnectionsContainer
                    getPeer={id => peers[id]}
                    onChange={forceUpdate}
                    onCreatePeer={peer => (peers[peer.id] = peer)}
                />
            </div>
            <div className={styles.rightPanel}>
                {showWelcome && renderInstructions()}
                {selectedPeer && <MessagePanel peer={selectedPeer} onSendMessage={forceUpdate} />}
            </div>
            {showInstructions && <p>TODO: render instructions modal containing the instructions component</p>}
        </div>
    )

    function renderAppInfo() {
        return (
            <div className={styles.appInfo}>
                <strong>P2P messaging app &nbsp;|&nbsp; v1.0.0</strong>
                {!showInstructions && <button onClick={() => setShowInstructions(true)}>Show instructions</button>}
            </div>
        )
    }

    function renderInstructions() {
        return (
            <div className={styles.welcomeMessage}>
                {showWelcome && renderWelcomeMessage()}
                <Instructions />
            </div>
        )
    }

    function handleRemovePeer(id: string) {
        const peer = peers[id]
        if (!peer) {
            return
        }

        peer.chan?.close()
        peer.conn.close()

        delete peers[id]
    }

    function renderWelcomeMessage() {
        return (
            <div>
                <h2>Welcome to our P2P web messaging app</h2>
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
}
