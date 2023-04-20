import styles from './ReceiveAnswerModal.module.scss'
import { Peer, Signal, receiveAnswer } from 'connection'
import { Modal } from './Modal'
import { LinkIcon } from './icons/LinkIcon'

interface Props {
    getPeer: (peerId: string) => Peer
}

/**
 * A React functional component that receives a signaling answer from a peer and displays it in a modal window.
 * @param {Object} props - The props object that contains the following properties:
 *   - getPeer {function} - A callback function to retrieve a peer object by ID.
 * @returns {JSX.Element} A React element representing the ReceiveAnswerModal component.
 */
export function ReceiveAnswerModal(props: Props) {
    return (
        <Modal
            handleSubmit={e => handleAnswer(e)}
            renderModal={() => (
                <div>
                    <p>Paste answer in the field below and submit</p>
                    <textarea autoComplete="off" rows={10} className={styles.textarea} name="answer" />
                </div>
            )}
            render={openModal => (
                <button onClick={handleOpenModal(openModal)}>
                    <LinkIcon />
                </button>
            )}
        />
    )

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const answer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = props.getPeer(answer.id)

        await receiveAnswer(peer, answer)
    }

    function handleOpenModal(openModal: () => void) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            openModal()
        }
    }
}
