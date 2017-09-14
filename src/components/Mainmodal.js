import React from 'react'
import ModalChart from './modals/Chart'
import ModalLoginSignUp from './modals/LoginSignUp'
import Allinone from './modals/Modal-All'

const Modals = props => {
    return props.isOpen === true ? (
	    	<div className="modal-container">
				  {(() => {
						switch (props.type) {
							case 'checkout':
								return <ModalChart 
										close={props.close} 
										items={props.items} 
										filter={props.filter} 
										isActive={props.isActive}
										orderLists={props.orderLists}
										current={props.current}
										/>
							case 'login':
								return <ModalLoginSignUp 
										type={props.type} 
										changeType={props.changeType}
										close={props.close} 
										/>
							case 'alert':
								return <Allinone 
										close={props.alertCloseModal}
										feel={props.feel}	
										message={props.message}
										/>
							default :
								return <ModalLoginSignUp 
										type={props.type} 
										changeType={props.changeType}
										close={props.close} 
										/>
						}
					})()}
	       	</div>
	    ): null
    
}
export default Modals

