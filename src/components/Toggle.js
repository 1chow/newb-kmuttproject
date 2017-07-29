import React from 'react'
import { logout } from '../helpers/firebase'

const Toggle = props => (
            <div className={"toggle "+(props.showToggle === true && 'toggle-open')}>
                <div className="toggle-container">
                    <div className="row text-center">
                        <button onClick={props.closetoggle} className="close">
                            <i className="fa fa-close fa-2x" aria-hidden="true"></i>
                        </button>	
                        <button className="button">
                            <i className="fa fa-address-card-o fa-2x" aria-hidden="true"></i>
                            <p>lorem</p>
                        </button>		

                        <button className="button">
                            <i className="fa fa-address-card-o fa-2x" aria-hidden="true"></i>
                            <p>lorem</p>
                        </button>		
                        <button className="button">
                            <i className="fa fa-address-card-o fa-2x" aria-hidden="true"></i>
                            <p>lorem</p>
                        </button>		
                        <button onClick={() => {logout()}} className="button">
                            <i className="fa fa-address-card-o fa-2x" aria-hidden="true"></i>
                            <p>Log Out</p>
                        </button>		
                    </div>
                </div>
            </div>
)

export default Toggle
