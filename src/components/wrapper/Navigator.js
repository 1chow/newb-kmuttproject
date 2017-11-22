import React from "react";
import { NavLink } from "react-router-dom";

class Header extends React.Component {

	handleLink = () => {
		this.props.getObjects()
		this.props.filter("default")
	}

	render() {
		return (
		<header>
				<div data-sticky-container>
					<div className="title-bar" data-sticky data-options="marginTop:0;" style={{width:100+'%'}}>
						<div className="row">
							<NavLink  onClick={this.handleLink} exact to="/">
								<div className="title-bar-left nav-left">
									<h1><i className="fa fa-gavel fa-1x"></i> AUCT</h1>
									<div className="nav-toggle-btn"></div>
								</div>
							</NavLink>
							<div className="title-bar-right nav-right">
								{ this.props.isLogin === true &&
									<button onClick={ () => this.props.triggler("checkout")} className="profile-botton">
										<span className="has-tip bottom" tabIndex="2" title="Your Cart!">
											<i className="fa fa-shopping-basket fa-2x" aria-hidden="true"></i>
										</span>
										
									</button>
								}
									<b className={"alert-top-btn " + (this.props.isRead === 0 ? "show" : null)} id="b-cart">N</b>
								{ this.props.isLogin === true ?
									<button className="profile-botton" onClick={this.props.toggle}>
										<span className="has-tip bottom" data-disable-hover="false">
											<img src={this.props.profilePicture} alt=""></img>
										</span>
									</button> :
									<button className="button success" onClick={() => this.props.triggler("login")}>
										Join Now
									</button>
								}
							</div>
						</div>
					</div>
				</div>
			</header>
		)
	}
}

export default Header
