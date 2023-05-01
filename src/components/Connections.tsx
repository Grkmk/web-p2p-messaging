import styles from './Connections.module.scss'
import { Peer } from 'connection'
import classnames from 'classnames'
import { ReceiveAnswerModal } from './ReceiveAnswerModal'
import { TrashIcon } from './icons/TrashIcon'
import { useEffect, useReducer } from 'react'

interface Props {
    peers: Peer[]
    selectedPeerId?: string | null
    getPeer: (id: string) => Peer
    onSelectPeer: (peer?: Peer) => void
    onRemovePeer: (id: string) => void
}

/**
 * A container component that displays a list of active and inactive peers, and allows the user to receive peer answer, remove or select a peer.
 * @param {Object} props       - The props object that contains the following properties:
 *   - peers {Array}           - An array of peer objects to be displayed.
 *   - onSelectPeer {function} - A callback function to be invoked when a peer is selected.
 *   - getPeer {function}      - A callback function to retrieve a peer object by ID.
 *   - onRemovePeer {function} - A callback function to be invoked when a peer is removed.
 *   - selectedPeerId {string} - The ID of the currently selected peer.
 * @returns {JSX.Element} A React element representing the container component.
 * (Requirements 3.1.7, 3.1.15, 3.1.19, 3.2.1)
 */
export function Connections({ peers, onSelectPeer, getPeer, onRemovePeer, selectedPeerId }: Props) {
    const activePeers = peers.filter(peer => peer.conn.connectionState === 'connected')
    const inactivePeers = peers.filter(peer => peer.conn.connectionState !== 'connected')
    const [, forceUpdate] = useReducer(x => x + 1, 0)

    // rerender every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

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

    /**
     * (Requirement 3.1.18)
     */
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

            if (selectedPeerId === peer.id) {
                onSelectPeer()
                return
            }

            onSelectPeer(peer)
        }
    }

    function handleRemovePeer(peer: Peer) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            onRemovePeer(peer.id)
        }
    }
}
