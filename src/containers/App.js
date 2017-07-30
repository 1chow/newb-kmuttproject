import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../components/animate/MainAnimated"


import Navigator from "../components/wrapper/Navigator"
import Categories from '../components/Categories'
import CheckOutinfo from '../components/Checkoutinfo'
import CheckOut from '../components/Checkout'
import Sellingareas from "../components/Sellingareas"
import Item from "../components/Item"
import FourZeroFour from "../components/FourZeroFour"
import Modals from '../components/Mainmodal'
import Toggle from '../components/Toggle'
import Admin from "../components/admin/Admin"

import { firebaseAuth , db , db2 , logout } from '../helpers/firebase'

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
			showToggle: false,
			isActive: 'default',
			typeModal: 'checkout',
			isLogin: false,
			User: "Guest",
			userUID: '',
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
					userUID: user.uid
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
					User: "Guest",
					userUID:''
				})
			}
		})
		  db2.ref('/items').on('value', Snapshot => {
	        let current_a = [];

	        Snapshot.forEach( childSnapshot => {
			  let data = childSnapshot.val();
			  let key = childSnapshot.key;
			  let current_ = data.bid.current;
			  let catagory_ = data.catagory;
			  let isActive_ = data.isActive;
	          let obj = {
	          	current  : current_,
				itemId : key,
				catagory: catagory_,
				isActive: isActive_ 			
	          }
	          current_a.push(obj);
			})
		    this.setState({current:current_a})
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

	timeDiff = (timestamp) => {
		let change = (timestamp/1000)+(60*60*7);
		return new Date(change * 1e3).toISOString().slice(-13, -5);
	}

	toggle = () => {
		this.setState({ showToggle: true });
	}
	closetoggle = () => {
		this.setState({ showToggle: false });
	}
	logout = () => {
		this.setState({ showToggle: false });
		logout()
	}

	render() {
		return (
			<div>
				<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
					{/* Navigator Bar */}
					<Navigator toggle={this.toggle} triggler={this.handleOpenModal} isLogin={this.state.isLogin} filter={this.filter} />
					<Categories categories={this.state.categories} isActive={this.state.isActive} filter={this.filter} />
					<Toggle logout={this.logout} closetoggle={this.closetoggle} showToggle={this.state.showToggle} />
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
												<Sellingareas current={this.state.current} isActive={this.state.isActive} close={this.handleCloseModal} items={this.state.items} timeDiff={this.timeDiff} />
											)}
										/>
										<Route
											path="/item/:id"
											render={props => (
												<Item current={this.state.current} {...props} items={this.state.items} timeDiff={this.timeDiff} />
											)}
										/>
										{/*<Route
											path="/checkout-info"
											render={props => (
												<CheckOutinfo filter={this.filter}/>
											)}
										/>*/}
										<Route
											path="/checkout"
											render={props => (
												<CheckOut userUID={this.state.userUID} filter={this.filter}/>
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
					isActive={this.state.isActive}
					orderLists={this.state.orderLists}
					current={this.state.current}
					timeDiff={this.timeDiff}
				/>
			</div>
		) 
	}
}