import styles from './UserInterfaceView.module.scss'
import { useContext, useEffect, useReducer, useState } from 'react'
import { Peer } from 'connection'
import { MessagePanel } from 'components/MessagePanel'
import { AddConnectionsContainer } from 'components/AddConnectionsContainer'
import { Connections } from 'components/Connections'
import { UserContext } from 'App'

// TODO: remove after testing
const mockPeer = (): Peer => ({
    id: (Math.random() * 100).toString(),
    username: 'mock user' + (Math.random() * 100).toString(),
    conn: new RTCPeerConnection(),
    enabled: Math.random() > 0.5,
    messages: [
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:40.162Z').toString() },
        { sentOrReceived: 'sent', data: 'hello', date: new Date('2023-04-02T10:19:41.162Z').toString() },
        {
            sentOrReceived: 'received',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        {
            sentOrReceived: 'sent',
            data: 'asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf asdfasdfasdf asdfasdf asdfasdfasdf asdfasd fasdfasdf asdfasdfasdfasd fasdfasd fas df sfasdfasdf asdfa sdfa sdf',
            date: new Date('2023-04-02T10:19:42.162Z').toString(),
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as any,
})

const mockedPeers = Array.from({ length: 50 }, () => mockPeer()).reduce((acc, peer) => {
    acc[peer.id] = peer
    return acc
}, {} as Record<string, Peer>)

export function UserInterfaceView() {
    const [peers] = useState<Record<string, Peer>>(mockedPeers)
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
                    onCreatePeer={peer => (peers[peer.id] = peer)}
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
    }
}
