import React, {FormEvent, useState} from 'react'
import {createPortal} from "react-dom"
import ModalContent from "./ModalForm"

export function WelcomingModal() {
    const [showModal, setShowModal] = useState(true);
    return (
        <>
            {!sessionStorage.getItem('username') && showModal && createPortal(
                <ModalContent
                    onSubmitUsername={handleSubmitUsername}
                />,
                document.body
            )}
        </>
    );

    function handleSubmitUsername(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const formJson = Object.fromEntries(formData.entries());
        sessionStorage.setItem("username", formJson['usernameField'] as string);
        setShowModal(false);
        console.log(sessionStorage.getItem('username'));
    }
}
