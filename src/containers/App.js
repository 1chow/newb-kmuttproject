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
			current:null,
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
			icon:null,
			userUID: '',
			timeNows: '',
			chartNow:[],
		};
	}
	componentWillMount() {
		this.getObjects()
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
				db2.ref('/users/' + user.uid + '/now').on('value', dataSnapshot => {
					let table_ = []
					dataSnapshot.forEach( childSnapshot => {
						let chartnows = childSnapshot.val()
						let chartnows_ = chartnows.itemId
						table_.push(chartnows_)
					})
					this.setState({chartNow: table_})
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
		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getCatagories")
		.then(response => {
			return response.json();
		})
		.then(json => {
			this.setState({
				categories: json
			})
		})
		db2.ref('/items').on('value', Snapshot => {
			let current_a = [];

	        Snapshot.forEach( childSnapshot => {
			  let data = childSnapshot.val();
			  let key = childSnapshot.key;
			  let current_ = data.bid.current;
			  let catagory_ = data.catagory;
			  let isActive_ = data.isActive;
			  let isDelete_ = data.isDelete;
			  let endTime_ = data.bid.endTime;
			  let maxBid_ = data.bid.maxBid;
			  let bidStep_ = data.bid.bidStep;
			  let own_ = data.bid.userId;
	          let obj = {
	          	current  : current_,
				itemId : key,
				catagory: catagory_,
				isActive: isActive_,
				isDelete: isDelete_,
				endTime: endTime_,
				maxBid: maxBid_,
				bidStep: bidStep_,
				own: own_
	          }
	          current_a.push(obj);
			})
			this.setState({current:current_a},() => fetch("https://us-central1-auctkmutt.cloudfunctions.net/getItems")
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
					let isDelete_ = object.isDelete
					let endTime_ = object.bid.endTime
					let timeNows_ = {
						timeNow  : timeNow_,
						_id  	 : id_,
						catagory : catagory_,
						isActive : isActive_,
						isDelete: isDelete_,
						endTime : endTime_
					}
					timeNows.push(timeNows_);
				})
				this.setState({
					items: json,
					timeNows:timeNows
				})
			})
			.catch( err => {  
				console.log(err)
			}))
		})
	}


	secondsToHms = (d,format) => {
		d = Number(d);
		var day = Math.floor(d / 3600 / 24);
		var h = Math.floor(d / 3600 % 24);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);


		var dayDisplay = day > 0 ? (day > 9 ? day : '0'+day ) : "00"
		var hDisplay = h > 0 ? (h > 9 ? h : '0'+h ) : "00"
		var mDisplay = m > 0 ? (m > 9 ? m : '0'+m ) : "00"
		var sDisplay = s > 0 ? (s > 9 ? s : '0'+s ) : "00"

		switch (format) {
			case 'day':
				return dayDisplay
			case 'hr':
				return hDisplay
			case 'min':
				return mDisplay
			case 'sec':
				return sDisplay
			default :
				return dayDisplay + hDisplay + mDisplay + sDisplay;
		}

	}


	convertTimeM = timestamp => {
		var d = new Date(parseInt(timestamp,10)),
			yy = d.getFullYear(),
			mm = ('0' + (d.getMonth() + 1)).slice(-2),
			dd = ('0' + d.getDate()).slice(-2),
			hh = d.getHours(), h = hh,
			min = ('0' + d.getMinutes()).slice(-2),
			sec = ('0' + d.getSeconds()).slice(-2),
			msec = ('0' + d.getMilliseconds()).slice(-2),
			time = dd + '-' + mm + '-' + yy + ', ' + h + ':' + min + ':' + sec +  ':' + msec + ' (UTC+7)';
	
		return time;

	}

	convertTime = timestamp => {
		var d = new Date(parseInt(timestamp,10)),
			yy = d.getFullYear(),
			mm = ('0' + (d.getMonth() + 1)).slice(-2),
			dd = ('0' + d.getDate()).slice(-2),
			hh = d.getHours(), h = hh,
			min = ('0' + d.getMinutes()).slice(-2),
			sec = ('0' + d.getSeconds()).slice(-2),
			time = dd + '-' + mm + '-' + yy + ', ' + h + ':' + min + ':' + sec;
	
		return time;

	}

	convertDuration = (start,end) =>{
		var d = (end - start)/1000;
		var day = Math.floor(d / 3600 / 24)
		var h = Math.floor(d / 3600 % 24)
		var dayDisplay = day > 0 ? (day > 9 ? day : '0'+day ) : "00"
		var hDisplay = h > 0 ? (h > 9 ? h : '0'+h ) : "00"

		var s = new Date(parseInt(start,10)),
			syy = s.getFullYear(),
			smm = ('0' + (s.getMonth() + 1)).slice(-2),
			sdd = ('0' + s.getDate()).slice(-2)

		var e = new Date(parseInt(end,10)),
			eyy = e.getFullYear(),
			emm = ('0' + (e.getMonth() + 1)).slice(-2),
			edd = ('0' + e.getDate()).slice(-2)
	
		return dayDisplay + ' day ' + hDisplay +' hr (' + sdd + '-' + smm + '-' + syy + ' to ' + edd + '-' + emm + '-' + eyy + ')'
	}

	tick() {
		let timeNows = []
		if(this.state.timeNows) {
		this.state.timeNows.map( (timeNow,i) => {
			let timeNow_
			if(timeNow.timeNow <= 1){
				timeNow_ = 0
				if(timeNow.isActive === 1){
					this.hide(i,timeNow._id)
					timeNow.isActive = 0
				}
			} else { timeNow_ = timeNow.timeNow - 1 }
			let timeNows_ = {
				timeNow  : timeNow_,
				_id : timeNow._id,
				catagory : timeNow.catagory,
				isActive : timeNow.isActive,
				isDelete : timeNow.isDelete,
				endTime : timeNow.endTime,
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
	alertOpenModal = (type,feel,message,icon) => {
		this.setState({ 
			typeModal: type,
			showModal: true,
			feel: feel,
			message: message,
			icon: icon,
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

	priceFormat = (price) => {
		var prices = price.toString().split(".");
	    prices[0] = prices[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return prices.join(".");
	}


	toggle = () => {
		this.setState({ showToggle: true });
	}
	handleclosetoggle = () => {
		this.getObjects()
		this.setState({ showToggle: false });
	}
	closetoggle = () => {
		this.setState({ showToggle: false });
	}
	logout = () => {
		this.setState({ showToggle: false });
		logout()
	}

	hide = (key,id) => {
		let {items, current} = this.state
		var fuck = null;
		items.filter( (item,i) => {
			if(item._id === id){
				fuck = i
				return 1
			}
			else{
				return -1
			}
		})
		let items_ = Object.assign({},items[fuck],{isActive:0})
		let current_ = Object.assign({},current[key],{isActive:0})
		items[fuck] = items_
		current[key] = current_
		this.setState({
			items:items,
			current:current,
		})
	}
	
	render() {
		return this.state.current !== null ? (
			<div>
				<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
					{/* Navigator Bar */}
					<Navigator 
						profilePicture={this.state.profilePicture} 
						toggle={this.toggle}
						triggler={this.handleOpenModal}
						isLogin={this.state.isLogin}
						filter={this.filter} 
						getObjects={this.handleclosetoggle}
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
						getObjects={this.handleclosetoggle}
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
												<Sellingareas 
													secondsToHms={this.secondsToHms}
													timeNows={this.state.timeNows}
													current={this.state.current} 
													isActive={this.state.isActive} 
													close={this.handleCloseModal} 
													items={this.state.items}
													priceFormat={this.priceFormat}
												/>
											)}
										/>
										<Route
											path="/item/:id"
											render={props => (
												<Item 
													secondsToHms={this.secondsToHms} 
													convertTime={this.convertTime}
													convertTimeM={this.convertTimeM}
													timeNows={this.state.timeNows} 
													isLogin={this.state.isLogin} 
													triggler={this.alertOpenModal} 
													current={this.state.current} 
													{...props} 
													items={this.state.items}
													userUID={this.state.userUID}
													priceFormat={this.priceFormat}
													convertDuration={this.convertDuration}
												/>
											)}
										/>
										<Route
											path="/checkout"
											render={props => (
												<CheckOut 
													userUID={this.state.userUID} 
													filter={this.filter}
												/>
											)}
										/>
										<Route
											path="/setting"
											render={props => this.state.isLogin === true ? (
												<Admin
													triggler={this.alertOpenModal}
													profilePicture={this.state.profilePicture}
													role={this.state.role}
													chartNow={this.state.chartNow}
													items={this.state.items}
													current={this.state.current}
													convertTimeM={this.convertTimeM}
													userUID={this.state.userUID}
												/>
											) : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
										/>
										<Route
											path="/admin"
											render={props => this.state.isLogin === true ? (
												<Admin
													triggler={this.alertOpenModal}
													profilePicture={this.state.profilePicture}
													role={this.state.role}
													convertTimeM={this.convertTimeM}
													chartNow={this.state.chartNow}
													items={this.state.items}
													current={this.state.current}
													userUID={this.state.userUID}
												/>
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
												<FourZeroFour getObjects={this.handleclosetoggle} />
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
					icon={this.state.icon}
					timeNows={this.state.timeNows}
					secondsToHms={this.secondsToHms} 	
					chartNow={this.state.chartNow}
					userUID={this.state.userUID}
					convertTime={this.state.convertTime}		
				/>
			</div>
		) : <div className='preload-gavel'><img src={require("../images/loading.png")} alt="Loading"></img></div>
	}
}
