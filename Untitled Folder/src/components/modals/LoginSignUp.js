import React, { Component } from "react";
import { Link } from "react-router-dom"
import { auth , login } from '../../helpers/firebase'

export default class LoginSignUp extends Component {
	state = { 
		registerError: null 
	}

	//handleSighupSuccess = () => {
	//	this.props.changeType("login")
	//	this.setState({registerError: null })
	//}

	handleFilter = (e) => {
		this.props.changeType('signup')
		this.setState({registerError: null })
		this.email.value = ''
		this.pw.value = ''
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.type === 'signup' ? (
			auth(this.email.value, this.pw.value , this.user.value)
			.then(this.props.close)
			.catch( err => this.setState({registerError: err.message }))
		) : (
			login(this.email.value, this.pw.value , this.props.close)
			.catch( err => this.setState({registerError: 'Invalid username/password.' }))
		)
	}

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
								{ this.state.registerError &&
									<div className="alert callout">
										<p><i className="fi-alert"></i>{this.state.registerError}</p>
									</div>
								}
							</div> : 
							<div className="small-12 columns relative text-center">
                                <hr className="hr-head"></hr>
                                <h3 className="head text-center">Sign Up</h3>
								{ this.state.registerError &&
									<div className="alert callout">
										<p><i className="fi-alert"></i>{this.state.registerError}</p>
									</div>
								}
                            </div>
							}
							<div className="small-12 columns">
								<div className="alert callout" style={{display: 'none'}}>
									<p><i className="fi-alert"></i> There are some errors in your form.</p>
								</div>
							</div>
							<form onSubmit={this.handleSubmit}>
								{ this.props.type === 'signup' &&
									<div className="small-12 columns">
										<label>
											<input ref={ user => this.user = user} type="text" placeholder="Your User Name"></input>
										</label>
									</div>
								}
								<div className="small-12 columns">
									<label>
										<input ref={ email => this.email = email} type="email" placeholder="E-mail Address"></input>
									</label>
								</div>
								<div className="small-12 columns">
									<label>
										<input ref={ pw => this.pw = pw} type="password" id="password" placeholder="Password"></input>
									</label>
								</div>
								{ this.props.type === 'signup' &&
									<div className="small-12 columns">
										<label>
											<input ref={ _pw => this._pw = _pw} type="password" id="password" placeholder="Re-Type Password"></input>
										</label>
									</div>
								}
								<div className="small-12 columns">
									{ this.props.type === 'login' &&
										<div>
											<input id="remember" type="checkbox"></input>
											<label htmlFor="checkbox1">Remember Me Pls.</label>
										</div>
									}
									<br></br>
									{ this.props.type === 'login' ?
										<button className="button success" type="submit" value="Submit">Login</button> 
											:
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
										<button onClick={this.handleFilter} className="hollow button">Sign Up</button>
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
