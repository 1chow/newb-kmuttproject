import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../components/animate/MainAnimated"


import Navigator from "../components/wrapper/Navigator"
import Categories from '../components/Categories'
import CheckOutinfo from '../components/Checkoutinfo'
import CheckOut from '../components/Checkout'
import SellingArea from "../components/Sellingarea"
import Item from "../components/Item"
import FourZeroFour from "../components/FourZeroFour"
import Modals from '../components/Mainmodal'
import Admin from '../components/Admin'

import { firebaseAuth } from '../helpers/firebase'

window.Perf = Perf;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			showModal: false,
			isActive: 'LE',
			typeModal: 'checkout',
			isLogin: false,
			User: "Guest",
		};
	}

	componentWillMount() {

		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getItems")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					items: json.slice(0, 16)
				});
			});

		this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					isLogin: true,
					User: user.email
				})
			} else {
				this.setState({
					isLogin: false,
					User: "Guest"
				})
			}
		})
	}

	componentWillUnmount () {
		this.removeListener()
	}

	//Modal function
	handleOpenModal = type => {
		this.setState({ showModal: true });
		this.setState({ typeModal: type });
		document.body.style.overflow = "hidden"
	}
	handleCloseModal = () => {
		this.setState({ showModal: false });
		this.setState({ typeModal: 'checkout' });
		document.body.style.overflow = null
	}
	filter = type => {
		this.setState({ isActive: type });
	}
	changeType = type => {
		this.setState({ typeModal: type });
	}
	render() {
		return (
			<div>
				<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
					{/* Navigator Bar */}
					<Navigator triggler={this.handleOpenModal} isLogin={this.state.isLogin} filter={this.filter} />
					<Categories isActive={this.state.isActive} filter={this.filter} />
					
					{/* Application Routes Zone */}
						<div className="row">
							<Route
							render ={ ({ location }) => (
								<TransitionGroup>
									<AnimatedSwitch
										key={location.key}
										location={location}
									>
										<Route
											exact
											path="/"
											render={props => (
												<SellingArea close={this.handleCloseModal} items={this.state.items} />
											)}
										/>
										<Route
											path="/item/:id"
											render={props => (
												<Item {...props} items={this.state.items} />
											)}
										/>
										<Route
											path="/checkout-info"
											render={props => (
												<CheckOutinfo/>
											)}
										/>
										<Route
											path="/checkout"
											render={props => (
												<CheckOut/>
											)}
										/>
										<Route
											path="/admin"
											render={props => (
												<Admin/>
											)}
										/>
										<Route 
											render={() => (
												<FourZeroFour/>
										)} />
									</AnimatedSwitch>
								</TransitionGroup>
							) }/>
						</div>
					
				</section>
				<Modals 
					close={this.handleCloseModal} 
					isOpen={this.state.showModal} 
					items={this.state.items} 
					type={this.state.typeModal}
					changeType={this.changeType}
					filter={this.filter}
				/>

				<div className="alert-bar-top">
					<p className="green">Login Sucessfuly</p>
				</div>
			</div>
		) 
	}
}