import styles from './UserInterfaceView.module.scss'
import { useReducer, useState } from 'react'
import { Peer } from 'connection'
import { MessagePanel } from 'components/MessagePanel'
import { AddConnectionsContainer } from 'components/AddConnectionsContainer'
import { Connections } from 'components/Connections'

export function UserInterfaceView() {
    const [peers] = useState<Record<string, Peer>>({})
    const [selectedPeer, setSelectedPeer] = useState<Peer | null>()
    const [, forceUpdate] = useReducer(x => x + 1, 0)

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
                {/* should only be shown if there are connections */}
                {!!peers && !selectedPeer && renderWelcomeMessage()}
                {selectedPeer && <MessagePanel peer={selectedPeer} onSendMessage={forceUpdate} />}
            </div>
        </div>
    )

    function renderAppInfo() {
        return (
            <div className={styles.appInfo}>
                <p>P2P messaging app</p>
                <p>v1.0.0</p>
            </div>
        )
    }

    function renderWelcomeMessage() {
        return (
            <div className={styles.welcomeMessage}>
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
                <h3>How to use</h3>
                There are two ways to connect to a peer, invite or be invited. In either approach, both peers need to
                have & keep the website open.
                <br />
                <br />
                Inviting a peer
                <ol>
                    <li>Generate an invite offer (see the left panel)</li>
                    <li>Send the generated offer to the party you would like to invite by any means</li>
                    <li>Ask your peer to generate an answer with the invite you sent and send it to you</li>
                    <li>Find the peer under the inavtive peers list on the left panel</li>
                    <li>Place and submit the received answer to establish connection</li>
                    <li>Find & click on the user in the active list to open the message panel</li>
                </ol>
                Receiving an invite
                <ol>
                    <li>Place & submit the received invite offer (see the left panel)</li>
                    <li>Send the generated answer to the peer by any means</li>
                    <li>
                        Wait for your peer place & submit your generated answer. If a connection was successfully
                        established, the peer should appear in the active peers list
                    </li>
                    <li>Click on the user in the active list to open the message panel</li>
                </ol>
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
}
