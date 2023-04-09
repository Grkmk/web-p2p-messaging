import styles from './Connections.module.scss'
import { Peer } from 'connection'
import classnames from 'classnames'
import { ReceiveAnswerModal } from './ReceiveAnswerModal'
import { TrashIcon } from './icons/TrashIcon'

interface Props {
    peers: Peer[]
    selectedPeerId?: string | null
    getPeer: (id: string) => Peer
    onSelectPeer: (peer: Peer) => void
    onRemovePeer: (id: string) => void
}

export function Connections({ peers, onSelectPeer, getPeer, onRemovePeer, selectedPeerId }: Props) {
    const activePeers = peers.filter(peer => peer.enabled)
    const inactivePeers = peers.filter(peer => !peer.enabled)

    return (
        <div className={styles.container}>
            <div>
                <h5>Inactive peers</h5>
                <div className={styles.peersContainer}>
                    {inactivePeers.length ? inactivePeers.map(renderInactivePeer) : renderNoPeersMessage()}
                </div>
            </div>
            <div>
                <h5>Active peers</h5>
                <div className={styles.peersContainer}>
                    {activePeers.length ? activePeers.map(renderActivePeer) : renderNoPeersMessage()}
                </div>
            </div>
        </div>
    )

    function renderInactivePeer(peer: Peer) {
        const className = classnames(styles.inactivePeer, {
            [styles.selected]: selectedPeerId === peer.id,
        })

        return (
            <div key={peer.id} onClick={handlePeerClick(peer)} className={className}>
                <p>{peer.username}</p>
                <div className={styles.buttonContainer}>
                    <ReceiveAnswerModal getPeer={getPeer} />
                    <button onClick={handleRemovePeer(peer)}>
                        <TrashIcon />
                    </button>
                </div>
            </div>
        )
    }

    function renderActivePeer(peer: Peer) {
        const className = classnames(styles.activePeer, {
            [styles.selected]: selectedPeerId === peer.id,
        })

        return (
            <div key={peer.id} onClick={handlePeerClick(peer)} className={className}>
                <p>{peer.username}</p>
                <div className={styles.buttonContainer}>
                    <button onClick={handleRemovePeer(peer)}>
                        <TrashIcon />
                    </button>
                </div>
            </div>
        )
    }

    function renderNoPeersMessage() {
        return <p className={styles.noPeersMessage}>There are no peers to show. Follow the instructions to add some.</p>
    }

    function handlePeerClick(peer: Peer) {
        return (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault()
            onSelectPeer(peer)
        }
    }

    function handleRemovePeer(peer: Peer) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            onRemovePeer(peer.id)
        }
    }
}
