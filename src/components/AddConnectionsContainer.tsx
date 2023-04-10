import { Peer } from 'connection'
import styles from './AddConnectionsContainer.module.scss'
import { GenerateOfferModal } from './GenerateOfferModal'
import { ReceiveOfferModal } from './ReceiveOfferModal'

interface Props {
    onChange: () => void
    onCreatePeer: (peer: Peer) => void
    getPeer: (peerId: string) => Peer
}

export function AddConnectionsContainer(props: Props) {
    return (
        <div className={styles.container}>
            <GenerateOfferModal onChange={props.onChange} onCreatePeer={props.onCreatePeer} />
            <ReceiveOfferModal onChange={props.onChange} onCreatePeer={props.onCreatePeer} />
        </div>
    )
}
