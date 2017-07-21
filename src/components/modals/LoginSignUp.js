import React, { Component } from "react";
import { Link } from "react-router-dom"

export default class LoginSignUp extends Component {
	render() {
		return (
				<div className="modal-core modal-mid modal-login">
					<div className="row modal-core-head">
						<h3 className="bold"><i className="fa fa-gavel"></i> AUCT</h3>
						<button onClick={this.props.close} className="close"><i className="fa fa-times"></i></button>
					</div>
					<div className="row">
						<div className="small-12 medium-11 small-centered">
							{ this.props.type === 'login' ?
							<div className="small-12 columns">
								<Link className="button facebook" to="/">Continue With Facebook</Link>
								<div className="hr-text-center">
									<hr></hr><p className="title">OR</p>
								</div>
							</div> : 
							<div className="small-12 columns relative text-center">
                                <hr className="hr-head"></hr>
                                <h3 className="head text-center">Sign Up</h3>
                            </div>
							}
							<div className="small-12 columns">
								<div className="alert callout" style={{display: 'none'}}>
									<p><i className="fi-alert"></i> There are some errors in your form.</p>
								</div>
							</div>
							<form>
								{ this.props.type === 'signup' &&
								<div className="small-12 columns">
									 <label>
                                        <input type="text" placeholder="Your User Name"></input>
                                    </label>
								</div>
								}
								<div className="small-12 columns">
									<label>
										<input type="text" placeholder="E-mail Address"></input>
									</label>
								</div>
								<div className="small-12 columns">
									<label>
										<input type="password" id="password" placeholder="Password"></input>
									</label>
								</div>
								{ this.props.type === 'signup' &&
								<div className="small-12 columns">
									 <label>
                                        <input type="password" id="password" placeholder="Re-Type Password"></input>
                                    </label>
								</div>
								}
								<div className="small-12 columns">
									{ this.props.type === 'login' &&
									<div><input id="remember" type="checkbox"></input><label htmlFor="checkbox1">Remember Me Pls.</label></div>
									}
									<br></br>
									{ this.props.type === 'login' ?
									<button onClick={this.props.authentication} className="button success">Login</button> :
									<button className="button success" type="submit" value="Submit">Join Now !!</button>
									}
								</div>
							</form>
							<div className="small-12 columns">
								<div className="hr-text-center">
									<hr></hr>
								</div>
							</div>
								<div className="small-12 medium-8 columns">
									<p className="signup">{ this.props.type === 'login' ? 'If You Need an Account ?' : 'OR Join With Facebook ?'}</p>
								</div>
								{ this.props.type === 'login' ?
								<div className="small-12 medium-4 columns">
									<button onClick={ () => this.props.changeType("signup")} className="hollow button">Sign Up</button>
								</div> :
								<div className="small-12 medium-4 columns">
                                <button onClick={ () => this.props.changeType("login")} className="hollow button"><i className="fa fa-facebook"></i> Join !!</button>
                            	</div>
								}
						</div>
					</div>
				</div>
		);
	}
}
