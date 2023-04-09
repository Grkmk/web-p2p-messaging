import { Modal } from './Modal'

export function WelcomingModal() {
    return (
        <form method="post" onSubmit={e => handleSubmitUsername(e)}>
            <Modal
                startOpen
                submit
                hideCloseButton
                renderModal={() => (
                    <div>
                        <p>Please enter a username</p>
                        <input type="text" name="usernameField" />
                    </div>
                )}
            />
        </form>
    )

    function handleSubmitUsername(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.target as HTMLFormElement)
        const formJson = Object.fromEntries(formData.entries())
        sessionStorage.setItem('username', formJson['usernameField'] as string)
    }
}
