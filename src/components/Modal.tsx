import React, {FormEvent, useState} from 'react'
import './Modal.scss'
import {createPortal} from "react-dom"
import ModalContent from "./ModalForm"

export default function WelcomingModal() {
    const [showModal, setShowModal] = useState(true);
    return (
        <>
            {showModal && createPortal(
                <ModalContent
                    onSubmitUsername={handleSubmitUsername}
                />,
                document.body
            )}
        </>
    );

    function handleSubmitUsername(e: FormEvent, username: string) {
        e.preventDefault();

        sessionStorage.setItem("username", username);
        setShowModal(false);
    }
}
