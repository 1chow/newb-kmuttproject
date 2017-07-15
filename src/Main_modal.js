import React from 'react'

const Modal = props => {
    return (
        <div>
            <div className="page modal">
                This is Modal Component
            </div>
            <button onClick={props.close}>Close Modal</button>
        </div>     
    )
}

export default Modal
