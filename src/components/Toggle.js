import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../helpers/firebase'

const Toggle = props => (
            <div className={"toggle "+(props.showToggle === true && 'toggle-open')}>
                <div className="toggle-container">
                    <div className="row text-center">
                        <button onClick={props.closetoggle} className="close">
                            <i className="fa fa-close fa-2x" aria-hidden="true"></i>
                        </button>	
                        <Link onClick={props.closetoggle} to='/' className="button">
                            <i className="fa fa-gavel fa-2x" aria-hidden="true"></i>
                            <p>Now Auct.</p>
                        </Link> 				
                        <Link onClick={props.closetoggle} to='/admin' className="button">
                            <i className="fa fa-cogs fa-2x" aria-hidden="true"></i>
                            <p>Setting</p>
                        </Link>	
                        {/* <Link onClick={props.closetoggle} to='/admin' className="button">
                            <i className="fa fa-cogs fa-2x" aria-hidden="true"></i>
                            <p>Admin</p>
                        </Link> */}	
                        <button onClick={() => {logout(),props.closetoggle()}} className="button">
                            <i className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
                            <p>Log Out</p>
                        </button>		
                    </div>
                </div>
            </div>
)

export default Toggle
