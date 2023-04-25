import styles from './ReceiveAnswerModal.module.scss'
import { Peer, Signal, receiveAnswer, isOfSignalInterface } from 'connection'
import { Modal } from './Modal'
import { LinkIcon } from './icons/LinkIcon'

interface Props {
    getPeer: (peerId: string) => Peer
}

/**
 * A React functional component that allows user to input and submit the received signaling answer from a peer.
 * @param {Object} props - The props object that contains the following properties:
 *   - getPeer {function} - A callback function to retrieve a peer object by ID.
 * @returns {JSX.Element} A React element representing the ReceiveAnswerModal component.
 */
export function ReceiveAnswerModal(props: Props) {
    return (
        <Modal
            handleSubmit={handleAnswer}
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

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>, closeModal: () => void) {
        let answer: Signal
        try {
            answer = JSON.parse(e.currentTarget.answer.value)
            if (!isOfSignalInterface(answer)) {
                throw new Error('Invalid input')
            }
        } catch (e) {
            alert('Please input a valid answer')
            return
        }

        const peer = props.getPeer(answer.id)

        try {
            await receiveAnswer(peer, answer)
        } catch (e) {
            alert(`Failed to receive answer for peer ${peer.username}`)
        }

        closeModal()
    }

    function handleOpenModal(openModal: () => void) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            openModal()
        }
    }
}
