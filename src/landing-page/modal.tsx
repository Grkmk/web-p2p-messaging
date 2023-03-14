import ModalForm from './modal-form'
import React from 'react'
import './modal.scss'

const Modal = (props: {content?: string}) => {
    return (
        <div className="welcomingModal">
            <div className="welcomingModalContent">
                <div className="welcomingModalHeader">
                    <h4 className="welcomingModalTitle">Welcome to our app</h4>
                </div>
                <div className="welcomingModalBody">
                    <ModalForm />
                </div>
                <div className="welcomingModalFooter" />
            </div>
        </div>
    )
}

export default Modal