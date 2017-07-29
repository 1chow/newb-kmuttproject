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
import Admin1 from "../components/Admin1"
import Admin2 from "../components/Admin2"
import FourZeroFour from "../components/FourZeroFour"
import Modals from '../components/Mainmodal'

import { firebaseAuth , db } from '../helpers/firebase'

window.Perf = Perf;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			categories:[],
			orderLists:[],
			current:[],
			showModal: false,
			isActive: 'default',
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
					items: json
				});
			});

		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getCatagories")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					categories: json
				});
			});

		this.removeListener = firebaseAuth().onAuthStateChanged( user => {
			if (user) {
				this.setState({
					isLogin: true,
					User: user.email,
				})
				db.child(`orders/${user.uid}/orderList`).on('value', dataSnapshot => {
				let orderLists = [];
					dataSnapshot.forEach( childSnapshot => {
						let orderList = childSnapshot.val();
						orderList['.key'] = orderList.key;
						orderLists.push(orderList);
					})
					 this.setState({
						orderLists: orderLists
					})
				})
			} else {
				this.setState({
					isLogin: false,
					User: "Guest"
				})
			}
		})
		db.child('items').on('value', Snapshot => {
	        let current_ = []
	        Snapshot.forEach( childSnapshot => {
			  let data = childSnapshot.val();
	          let current = data.bid.current;
	          current_.push(current);
			})
		    this.setState({current:current_})
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
	getOrderLists = Obj => {
		this.setState({ orderLists: Obj });
	}



	//Timer Function

	timeDiff = (timestamp1, timestamp2) => {
		let difference = timestamp1 - timestamp2;
		let daysDifference = difference/1000;
		return new Date(daysDifference * 1e3).toISOString().slice(-13, -5);
	}

	render() {
		return (
			<div>
				<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
					{/* Navigator Bar */}
					<Navigator triggler={this.handleOpenModal} isLogin={this.state.isLogin} filter={this.filter} />
					<Categories categories={this.state.categories} isActive={this.state.isActive} filter={this.filter} />
					
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
												<SellingArea isActive={this.state.isActive} close={this.handleCloseModal} items={this.state.items} timeDiff={this.timeDiff} />
											)}
										/>
										<Route
											path="/item/:id"
											render={props => (
												<Item {...props} items={this.state.items} timeDiff={this.timeDiff} />
											)}
										/>
										<Route
											path="/checkout-info"
											render={props => (
												<CheckOutinfo filter={this.filter}/>
											)}
										/>
										<Route
											path="/checkout"
											render={props => (
												<CheckOut filter={this.filter}/>
											)}
										/>
										<Route
											path="/admin1"
											render={props => (
												<Admin1 isActive={this.state.isActive} filter={this.filter} />
											)}
										/>
										<Route
											path="/admin2"
											render={props => (
												<Admin2 isActive={this.state.isActive} filter={this.filter} />
											)}
										/>
										<Route
											path="/admin3"
											render={props => (
												<Admin1 isActive={this.state.isActive} filter={this.filter} />
											)}
										/>
										<Route
											path="/admin4"
											render={props => (
												<Admin2 isActive={this.state.isActive} filter={this.filter} />
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
					isActive={this.state.isActive}
					orderLists={this.state.orderLists}
				/>

				<div className="alert-bar-top">
					<p className="green">Login Sucessfuly</p>
				</div>
			</div>
		) 
	}
}