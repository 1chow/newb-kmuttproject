import React, { Component } from "react";
import { Link } from "react-router-dom"
import { auth , login } from '../../helpers/firebase'
import firebase from 'firebase'

export default class LoginSignUp extends Component {
	state = {
		user:null,
		email: null,
		pw:null,
		_pw:null,
		isAuthen:false,
	}

	handleFilter = (e) => {
		this.props.changeType('signup')
		this.setState({
			user:null,
			email: null,
			pw:null,
			_pw:null,
		})
		this.email.value = ''
		this.pw.value = ''
	}

	fixHandleFilter = (e) => {
		this.setState({
			user:null,
			email: null,
			pw:null,
			_pw:null,
		})
		this.email.value = ''
		this.pw.value = ''
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.setState({
			user:null,
			email:null,
			pw:null,
			_pw:null,
			isAuthen:true,
		})
		if(this.props.type === 'signup') {
			let test_mail = this.emailValidate(this.email.value)
			let test_pw = this.pwValidate(this.pw.value)
			let test_retype = this._pwValidate(this._pw.value)
			let test_user = this.userValidate(this.user.value)
			let isValid = test_mail && test_pw && test_retype && test_user 
			if(isValid === true){
				this.sighUp()
			}
		} else {
			let test_mail = this.emailValidate(this.email.value)
			let test_pw = this.pwValidate(this.pw.value)
			let isValid = test_mail && test_pw
			if(isValid === true){
				this.logIn()
			}
		}
	}

	logIn = () => {
		this.setState({isAuthen:true})
		login(this.email.value.slice(0,50), this.pw.value , this.props.close)
		.then(this.setState({isAuthen:false}))
		.catch( err => this.setState({pw:err.code,isAuthen:false},() => setTimeout(() => this.setState({pw:null}),5000)))
	}

	sighUp = () => {
		firebase.database().ref('/users').once('value', snapshot => {
			var matchU = [];
			snapshot.forEach((childSnapshot) => {
				var data = childSnapshot.val()
				var uName = data.info.displayName
				var uName_ = this.user.value

				if (uName === uName_) {
					matchU.push(uName)
				}
			})//child
			if (matchU.length > 0) {					
				this.setState({_pw: 'Username already been used'})
			} else {
				auth(this.email.value.slice(0,50), this.pw.value , this.user.value.slice(0,50))
				.then(this.props.close)
				.catch( err => this.setState({_pw:err.code,isAuthen:false},() => setTimeout(() => this.setState({_pw:null}),5000)))
			}
		}) 
	}

	userValidate = input => {
		if(input.trim().length === 0){
			this.setState({user:"Username was empty",isAuthen:false})
			setTimeout(() => this.setState({user:null}),5000)
			return false
		} else if(input.trim().length >= 50) {
			this.setState({user:"length >= 50",isAuthen:false})
			setTimeout(() => this.setState({user:null}),5000)
			return false
		} else if(this.regCharacter(input.trim()) === false) {
			this.setState({user:"Username must be Character",isAuthen:false})
			setTimeout(() => this.setState({user:null}),5000)
			return false
		} else return true
	}

	emailValidate = input => {
		if(input.trim().length === 0){
			this.setState({email:"Email was empty",isAuthen:false})
			setTimeout(() => this.setState({email:null}),5000)
			return false
		} else if(input.trim().length >= 70) {
			this.setState({email:"length >= 70",isAuthen:false})
			setTimeout(() => this.setState({email:null}),5000)
			return false
		} else if(this.regEmail(input.trim()) === false) {
			this.setState({email:"Wasn't email format",isAuthen:false})
			setTimeout(() => this.setState({email:null}),5000)
			return false
		} else return true
	}

	pwValidate = input => {
		if(input.trim().length === 0){
			this.setState({pw:"Password was empty",isAuthen:false})
			setTimeout(() => this.setState({pw:null}),5000)
			return false
		} else if(input.trim().length <= 5) {
			this.setState({pw:"Password must contain at least six characters",isAuthen:false})
			setTimeout(() => this.setState({pw:null}),5000)
			return false
		} else if(input.trim().length >= 30) {
			this.setState({pw:"Password so long",isAuthen:false})
			setTimeout(() => this.setState({pw:null}),5000)
			return false
		} else if(this.regCharacter(input.trim()) === false) {
			this.setState({pw:"Password must be Character",isAuthen:false})
			setTimeout(() => this.setState({pw:null}),5000)
			return false
		} else return true
	}

	_pwValidate = input => {
		if(input.trim().length === 0){
			this.setState({_pw:"Password was empty",isAuthen:false})
			setTimeout(() => this.setState({_pw:null}),5000)
			return false
		} else if(input.trim().length <= 5) {
			this.setState({_pw:"Password must contain at least six characters",isAuthen:false})
			setTimeout(() => this.setState({_pw:null}),5000)
			return false
		} else if(input.trim().length >= 30) {
			this.setState({_pw:"Password so long",isAuthen:false})
			setTimeout(() => this.setState({_pw:null}),5000)
			return false
		} else if(this.regCharacter(input.trim()) === false) {
			this.setState({_pw:"Password must be Character",isAuthen:false})
			setTimeout(() => this.setState({_pw:null}),5000)
			return false
		} else if(this.pw.value !== input) {
			this.setState({_pw:"Must match the previous entry",isAuthen:false})
			setTimeout(() => this.setState({_pw:null}),5000)
			return false
		} else return true
	}

	regEmail = email => {
		let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
		return re.test(email);
	}

	regCharacter = pw => {
		let re = /^[-_a-zA-Z0-9.]+$/
		return re.test(pw);
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
							</div> : 
							<div className="small-12 columns relative text-center">
                                <hr className="hr-head"></hr>
                                <h3 className="head text-center">Sign Up</h3>
                            </div>
							}
							<form onSubmit={this.handleSubmit}>
								{ this.props.type === 'signup' &&
									<div className="small-12 columns">
										<label>
											<input ref={ user => this.user = user} type="text" placeholder="Your User Name"></input>
										</label>
										{ this.state.user &&
											<div className="alert callout">
												<p><i className="fi-alert"></i>{this.state.user}</p>
											</div>
										}
									</div>
								}
								<div className="small-12 columns">
									<label>
										<input ref={ email => this.email = email} type="email" placeholder="E-mail Address"></input>
									</label>
									{ this.state.email &&
										<div className="alert callout">
											<p><i className="fi-alert"></i>{this.state.email}</p>
										</div>
									}
								</div>
								<div className="small-12 columns">
									<label>
										<input ref={ pw => this.pw = pw} type="password" id="password" placeholder="Password"></input>
									</label>
									{ this.state.pw &&
										<div className="alert callout">
											<p><i className="fi-alert"></i>{this.state.pw}</p>
										</div>
									}
								</div>
								{ this.props.type === 'signup' &&
									<div className="small-12 columns">
										<label>
											<input ref={ _pw => this._pw = _pw} type="password" id="password" placeholder="Re-Type Password"></input>
										</label>
										{ this.state._pw &&
											<div className="alert callout">
												<p><i className="fi-alert"></i>{this.state._pw}</p>
											</div>
										}
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
									{this.props.type === 'login' ?
										( this.state.isAuthen === true ?
											<button className="button success" type="submit" value="Submit" disabled="true">Login</button> 
												:
											<button className="button success" type="submit" value="Submit">Login</button> 
										) :
										(	this.state.isAuthen === true ?
											<button className="button success" type="submit" value="Submit" disabled="true">Join Now !!</button>
												:
											<button className="button success" type="submit" value="Submit">Join Now !!</button>
										)
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
										<button onClick={ () => {this.props.changeType("login");this.fixHandleFilter();}} className="hollow button"><i className="fa fa-facebook"></i> Join !!</button>
									</div>
								}
						</div>
					</div>
				</div>
		);
	}
}
