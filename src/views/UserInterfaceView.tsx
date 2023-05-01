import styles from './UserInterfaceView.module.scss'
import { useContext, useEffect, useReducer, useState } from 'react'
import { Peer } from 'connection'
import { MessagePanel } from 'components/MessagePanel'
import { AddConnectionsContainer } from 'components/AddConnectionsContainer'
import { Connections } from 'components/Connections'
import { UserContext } from 'App'

/**
 * The main user interface component of the app.
 * Displays the info section, connections and message panels. The component also stores the peers, the selected peer, and whether to show the welcome message or not.
 * @returns {JSX.Element} a React component that renders the user interface.
 */
export function UserInterfaceView() {
    const [peers, setPeers] = useState<Record<string, Peer>>({})
    const [selectedPeer, setSelectedPeer] = useState<Peer | null>()
    const [showWelcome, setShowWelcome] = useState<boolean>(true)
    const [, forceUpdate] = useReducer(x => x + 1, 0)
    const username = useContext(UserContext).username

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
                    selectedPeerId={selectedPeer?.id}
                    onRemovePeer={id => handleRemovePeer(id)}
                    getPeer={id => peers[id]}
                />
                <AddConnectionsContainer
                    getPeer={id => peers[id]}
                    onChange={forceUpdate}
                    onCreatePeer={peer => setPeers({ ...peers, [peer.id]: peer })}
                />
            </div>
            <div className={styles.rightPanel}>
                <MessagePanel
                    peer={selectedPeer}
                    onSendMessage={forceUpdate}
                    showInstructionsWithWelcome={showWelcome}
                />
            </div>
        </div>
    )

    /**
     * (Requirement 3.1.2)
     */
    function renderAppInfo() {
        return (
            <div className={styles.appInfoContainer}>
                <div className={styles.appInfo}>
                    <h2>{username}</h2>
                    <div>
                        <p>P2P messaging app</p>
                        <p>|</p>
                        <p>v1.0</p>
                        {/* because having a selected peer will hide the instructions and show the messages instead */}
                    </div>
                </div>
                {selectedPeer && (
                    <button onClick={() => setSelectedPeer(null)}>
                        Show
                        <br />
                        instructions
                    </button>
                )}
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
        setPeers(peers)
        setSelectedPeer(null)
        forceUpdate()
    }
}
