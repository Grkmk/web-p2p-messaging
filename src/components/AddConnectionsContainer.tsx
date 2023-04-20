import { Peer } from 'connection'
import styles from './AddConnectionsContainer.module.scss'
import { GenerateOfferModal } from './GenerateOfferModal'
import { ReceiveOfferModal } from './ReceiveOfferModal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
    getPeer: (peerId: string) => Peer
}

/**
 * A container component for adding connections that renders a GenerateOfferModal and ReceiveOfferModal.
 * @param {Object} props - The props object that contains the following properties:
 *   - onChange {function}     - A callback function to be invoked when the state of a peer changes.
 *   - onCreatePeer {function} - A callback function to be invoked when a new peer is created.
 * @returns {JSX.Element} A React element representing the container component.
 */
export function AddConnectionsContainer(props: Props) {
    return (
        <div className={styles.container}>
            <GenerateOfferModal onChange={props.onChange} onCreatePeer={props.onCreatePeer} />
            <ReceiveOfferModal onChange={props.onChange} onCreatePeer={props.onCreatePeer} />
        </div>
    )
}
