import React from 'react'
import ModalChart from './modals/modalChart'
import Login from './modals/Login'

const Modals = props => {
    return props.isOpen === true ? (
	    	<div className="modal-container">
				{
				props.type === 'checkout' ?
	       		<ModalChart close={props.close} projects={props.projects} />
				   : <Login close={props.close} projects={props.projects} />
				}
	       	</div>
	    ): null
    
}
export default Modals
