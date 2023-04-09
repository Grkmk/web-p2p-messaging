import styles from './ReceiveAnswerModal.module.scss'
import { Peer, Signal, receiveAnswer } from 'connection'
import { Modal } from './Modal'
import { LinkIcon } from './icons/LinkIcon'

interface Props {
    getPeer: (peerId: string) => Peer
}

export function ReceiveAnswerModal(props: Props) {
    return (
        <form onSubmit={e => handleAnswer(e)}>
            <Modal
                submit
                renderModal={() => (
                    <div>
                        <p>Paste answer in the field below and submit</p>
                        <textarea rows={10} className={styles.textarea} name="answer" />
                    </div>
                )}
                render={openModal => (
                    <button onClick={openModal}>
                        <LinkIcon />
                    </button>
                )}
            />
        </form>
    )

    async function handleAnswer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const answer: Signal = JSON.parse(e.currentTarget.answer.value)
        const peer = props.getPeer(answer.id)

        await receiveAnswer(peer, answer)
    }
}
