import React from 'react'
import ModalChart from './modals/modalChart'

const Modals = props => {
    return props.isOpen === true ? (
	    	<div className="modal-container">
	       		<ModalChart close={props.close} projects={props.projects} />
	       	</div>
	    ): null
    
}
export default Modals
