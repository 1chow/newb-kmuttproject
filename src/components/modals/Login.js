import React, { Component } from "react";
import { Link } from "react-router-dom"
export default class Login extends Component {
	render() {
		return (
				<div className="modal-core modal-mid modal-login">
					<div className="row modal-core-head">
						<h3 className="bold"><i className="fa fa-gavel"></i> AUCT</h3>
						<button onClick={this.props.close} className="close"><i className="fa fa-times"></i></button>
					</div>
					<div className="row">
						<div className="small-12 medium-11 small-centered">
							<div className="small-12 columns">
								<Link className="button facebook" to="/">Continue With Facebook</Link>
								<div className="hr-text-center">
									<hr></hr><p className="title">OR</p>
								</div>
							</div>
							<div className="small-12 columns">
								<div className="alert callout" style={{display: 'none'}}>
									<p><i className="fi-alert"></i> There are some errors in your form.</p>
								</div>
							</div>
							<form>
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
								<div className="small-12 columns">
									<input id="remember" type="checkbox"></input><label htmlFor="checkbox1">Remember Me Pls.</label>
									<br></br>
									<button className="button success" type="submit" value="Submit">Login !!</button>
								</div>
							</form>
							<div className="small-12 columns">
								<div className="hr-text-center">
									<hr></hr>
								</div>
							</div>
								<div className="small-12 medium-8 columns">
									<p className="signup">If You Need an Account ?</p>
								</div>
								<div className="small-12 medium-4 columns">
									<button className="hollow button" href="#">Sign Up</button>
								</div>
						</div>
					</div>
				</div>
		);
	}
}
