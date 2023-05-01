import { Modal } from './Modal'

interface Props {
    onSetUsername: (username: string) => void
}

/**
 * A container component that prompts the user to enter a username.
 * @param {Object} props - The props object that contains the following properties:
 *   - onSetUsername {function} - A callback function to be invoked when the user submits their username.
 * @returns {JSX.Element} A React element representing the container component.
 * (Requirement 3.1.1)
 */
export function WelcomingModal(props: Props) {
    return (
        <Modal
            startOpen
            handleSubmit={e => handleSubmitUsername(e)}
            hideCloseButton
            renderModal={() => (
                <div>
                    <p>Please enter a username</p>
                    <input autoComplete="off" type="text" name="usernameField" />
                </div>
            )}
        />
    )

    function handleSubmitUsername(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        props.onSetUsername(e.currentTarget.usernameField.value)
    }
}
