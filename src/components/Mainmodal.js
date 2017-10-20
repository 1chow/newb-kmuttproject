import React from 'react'
import ModalChart from './modals/Chart'
import ModalLoginSignUp from './modals/LoginSignUp'
import Allinone from './modals/Modal-All'

const Modals = props => {



    return props.isOpen === true ? (
	    	<div className={"modal-container"}>
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
										timeNows={props.timeNows}
										secondsToHms={props.secondsToHms}
										chartNow={props.chartNow}
										userUID={props.userUID}
										convertTime={props.convertTime} 
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
										icon={props.icon}
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

