import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route, Redirect } from "react-router-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../components/animate/MainAnimated"


import Navigator from "../components/wrapper/Navigator"
import Categories from '../components/Categories'
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
			profilePicture: null,
			role:null,
			feel:null,
			message:null,
			userUID: '',
			timeNows: '',
		};
	}
	componentWillMount() {
		this.getObjects()
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
				db.child(`users/${user.uid}/info`).on('value', dataSnapshot => {
						let user = dataSnapshot.val();
						this.setState({
							isLogin: true,
							User: user.email,
							profilePicture: user.photoUrl,
							role:user.role,
							userUID: user.uid
						})
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
					profilePicture:null,
					role:null,
					userUID:''
				})
			}
		})
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	}

	componentWillUnmount () {
		this.removeListener()
	}

	getObjects = () => {
		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getItems")
		.then(response => {
			return response.json();
		})
		.then(json => {
			let timeNows =[]
			json.forEach( (object,i) => {
				let timeNow_ = ((object.bid.endTime - object.timeNow)/1000)
				let id_ = object._id
				let catagory_ = object.catagory
				let isActive_ = object.isActive
				let timeNows_ = {
					timeNow  : timeNow_,
					_id  	 : id_,
					catagory : catagory_,
					isActive : isActive_
				}
				timeNows.push(timeNows_);
			})
			console.log(json)
			this.setState({
				items: json,
				timeNows:timeNows
			});
		});
		db2.ref('/items').on('value', Snapshot => {
	        let current_a = [];

	        Snapshot.forEach( childSnapshot => {
			  let data = childSnapshot.val();
			  let key = childSnapshot.key;
			  let current_ = data.bid.current;
			  let catagory_ = data.catagory;
			  let isActive_ = data.isActive;
			  let endTime_ = data.bid.endTime;
	          let obj = {
	          	current  : current_,
				itemId : key,
				catagory: catagory_,
				isActive: isActive_,
				endTime: endTime_,		
	          }
	          current_a.push(obj);
			})
		    this.setState({current:current_a})
		  })
	}

	secondsToHms = (d) => {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);

		var hDisplay = h > 0 ? (h > 9 ? h+':' : '0'+h+':') : "00:"
		var mDisplay = m > 0 ? (m > 9 ? m+':' : '0'+m+':') : "00:"
		var sDisplay = s > 0 ? (s > 9 ? s : '0'+s) : "00"
		return hDisplay + mDisplay + sDisplay; 
	}

	tick() {
		let timeNows = []
		if(this.state.timeNows) {
		this.state.timeNows.map( timeNow => {
			let timeNow_
			if(timeNow.timeNow <= 0){
				timeNow_ = 0
			} else { timeNow_ = timeNow.timeNow - 1 }
			let timeNows_ = {
				timeNow  : timeNow_,
				_id : timeNow._id,
				catagory : timeNow.catagory,
				isActive : timeNow.isActive	
			}
			timeNows.push(timeNows_);
			return timeNows_
		})
		this.setState({timeNows:timeNows})
		}
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
	alertOpenModal = (type,feel,message) => {
		this.setState({ 
			typeModal: type,
			showModal: true,
			feel: feel,
			message: message,
		 });
		document.body.style.overflow = "hidden"
	}
	alertCloseModal = () => {
		this.setState({ 
			typeModal: 'checkout',
			showModal: false,
			feel: null,
			message: null,
		 });
		document.body.style.overflow = null
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
					<Navigator 
						profilePicture={this.state.profilePicture} 
						toggle={this.toggle}
						triggler={this.handleOpenModal}
						isLogin={this.state.isLogin}
						filter={this.filter} 
						getObjects={this.getObjects}
					/>
					<Categories 
						categories={this.state.categories} 
						isActive={this.state.isActive} 
						filter={this.filter}
					 />
					<Toggle 
						role={this.state.role} 
						logout={this.logout} 
						closetoggle={this.closetoggle} 
						showToggle={this.state.showToggle}
					 />
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
												<Sellingareas secondsToHms={this.secondsToHms} timeNows={this.state.timeNows} current={this.state.current} isActive={this.state.isActive} close={this.handleCloseModal} items={this.state.items} />
											)}
										/>
										<Route
											path="/item/:id"
											render={props => (
												<Item secondsToHms={this.secondsToHms} timeNows={this.state.timeNows} isLogin={this.state.isLogin} triggler={this.alertOpenModal} current={this.state.current} {...props} items={this.state.items} />
											)}
										/>
										<Route
											path="/checkout"
											render={props => (
												<CheckOut userUID={this.state.userUID} filter={this.filter}/>
											)}
										/>
										<Route
											path="/setting"
											render={props => this.state.isLogin === true ? (
												<Admin triggler={this.alertOpenModal} profilePicture={this.state.profilePicture} role={this.state.role} />
											) : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
										/>
										<Route
											path="/admin"
											render={props => this.state.isLogin === true ? (
												<Admin triggler={this.alertOpenModal} profilePicture={this.state.profilePicture} role={this.state.role} />
											) : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
										/>
										{/* Test Zone */}
										<Route
											exact
											path="/playground"
											render={props => (
												<div>This test pages</div>
											)}
										/>
										{/* Test Zone */}
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
					alertCloseModal={this.alertCloseModal}
					feel={this.state.feel}	
					message={this.state.message}			
				/>
			</div>
		) 
	}
}