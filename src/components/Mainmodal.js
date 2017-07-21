import React from 'react'
import ModalChart from './modals/Chart'
import ModalLoginSignUp from './modals/LoginSignUp'

const Modals = props => {
    return props.isOpen === true ? (
	    	<div className="modal-container">
				{
				props.type === 'checkout' ?
	       		<ModalChart close={props.close} projects={props.projects} />
				   : <ModalLoginSignUp type={props.type} changeType={props.changeType} close={props.close} authentication={props.authentication} />
				}
	       	</div>
	    ): null
    
}
export default Modals
