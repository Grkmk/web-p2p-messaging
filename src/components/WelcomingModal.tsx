import { Modal } from './Modal'

interface Props {
    onSetUsername: (username: string) => void
}

export function WelcomingModal(props: Props) {
    return (
        <Modal
            startOpen
            handleSubmit={e => handleSubmitUsername(e)}
            hideCloseButton
            renderModal={() => (
                <div>
                    <p>Please enter a username</p>
                    <input type="text" name="usernameField" />
                </div>
            )}
        />
    )

    function handleSubmitUsername(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        props.onSetUsername(e.currentTarget.usernameField.value)
    }
}
