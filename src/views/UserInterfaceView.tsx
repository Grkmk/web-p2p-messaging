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
                {renderLogo()}
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
                {!!peers && !selectedPeer && renderSelectPeerHelp()}
                {selectedPeer && <MessagePanel peer={selectedPeer} onSendMessage={forceUpdate} />}
            </div>
        </div>
    )

    // TODO
    function renderLogo() {
        return null
    }

    // TODO
    function renderSelectPeerHelp() {
        return null
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
