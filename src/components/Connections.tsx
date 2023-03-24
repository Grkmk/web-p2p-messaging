import styles from './Connections.module.scss'
import { Peer, receiveAnswer, Signal } from 'connection'

interface Props {
    peers: Peer[]
    getPeer: (id: string) => Peer
    onSelectPeer: (peer: Peer) => void
    onRemovePeer: (id: string) => void
}

export function Connections({ peers, onSelectPeer, getPeer, onRemovePeer }: Props) {
    if (!peers.length) {
        // TODO: show info about how to add connections
        return null
    }

    const activePeers = peers.filter(peer => peer.enabled)
    const inactivePeers = peers.filter(peer => !peer.enabled)

    return (
        <div className={styles.container}>
            {inactivePeers.map(renderInactivePeer)}
            {activePeers.map(renderActivePeer)}
        </div>
    )

    function renderInactivePeer(peer: Peer) {
        return (
            <div onClick={handlePeerClick(peer)}>
                {/* TODO: replace with peer name */}
                {/* changed to peer name*/}
                {peer.username}
                {/* TODO: move to modal & only show an icon button */}
                <form onSubmit={e => handleAnswer(e)}>
                    <textarea name="answer" />
                    <button type="submit">Receive answer</button>
                </form>
                {/* TODO: replace text with remove icon */}
                <button onClick={handleRemovePeer(peer)}>remove</button>
            </div>
        )
    }

    function renderActivePeer(peer: Peer) {
        return (
            <div onClick={handlePeerClick(peer)}>
                {/* TODO: replace with peer name */}
                {/*changed to peer.username*/}
                {peer.username}
                {/* TODO: replace text with remove icon */}
                <button onClick={handleRemovePeer(peer)}>remove</button>
            </div>
        )
    }

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const answer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = getPeer(answer.id)

        await receiveAnswer(peer, answer)
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
