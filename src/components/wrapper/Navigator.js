import React from "react";
import { NavLink } from "react-router-dom";
import { logout } from '../../helpers/firebase'

class Header extends React.Component {
	state={scrollTop:false}
	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.scrollTop === nextState.scrollTop) {
            if (this.props.isLogin === nextProps.isLogin) {
				return false
			} else { return true }
        } else { return true }
	}
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	//Scroll function
	handleScroll = e => {
		let scrollTop = e.target.body.scrollTop
		scrollTop >= 132 ?
		this.setState({ scrollTop:true }) : this.setState({ scrollTop:false })
	}

	render() {
		return (
		<header>
				<div data-sticky-container>
					<div className={"title-bar " + (this.state.scrollTop ? 'nav-fix' : null)} data-sticky data-options="marginTop:0;" style={{width:100+'%'}}>
						<div className="row">
							<NavLink  onClick={ () => this.props.filter("default")} exact to="/">
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
								<b className="alert-top-btn" id="b-cart">1</b>
								{ this.props.isLogin === true ?
								<button className="profile-botton" onClick={() => {logout()}}>
									<span className="has-tip bottom" data-disable-hover="false">
										<img src="https://scontent.fbkk12-2.fna.fbcdn.net/v/t1.0-1/p160x160/10590625_870609506283335_1688425455264656623_n.jpg?oh=29b4ec66619473227bed4d94f03a55e4&oe=59A32BD3" alt=""></img>
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
