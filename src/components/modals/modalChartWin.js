import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { Link } from 'react-router-dom'
import { firebaseAuth , db } from '../../helpers/firebase'


export default class ModalChartWin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orderLists: [],
			animations: [],
			orderPrice:''
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.orderLists);
		let user = firebaseAuth().currentUser
		if (user) {
		db.child(`orders/${user.uid}/orderPrice`).once('value', dataSnapshot => {
			let orderPrice = dataSnapshot.val();
				this.setState({orderPrice:orderPrice})
			})
		}
	}

	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.orderLists.length && nextProps.orderLists.length) {
			this._renderProjects(nextProps.orderLists);
		}
	}

	// Animation Logic
	_renderProjects(orderLists) {
		this.setState(
			{
				orderLists: orderLists,
				animations: orderLists.map((_, i) => new Animated.Value(0))
			},
			() => {
				Animated.stagger(
					100,
					this.state.animations.map(anim =>
						Animated.spring(anim, { toValue: 1 })
					)
				).start();
			}
		);
	}
	handleLinktoCheckOut = () => {
		this.props.close()
		this.props.filter('YD')
	}

	componentWillUnmount() {
		let user = firebaseAuth().currentUser
		if (user) {
			db.child(`orders/${user.uid}/orderPrice`).off()
		}
	}

	render() {
		return this.props.orderLists.length !== 0 ?  (
				<div className="row">
					<div className="small-12 large-6 columns post-feed win-list">
						<TransitionGroup>
								{this.state.orderLists.map((orderList, i) => {
									const style = {
										opacity: this.state.animations[i],
										transform: Animated.template`
											translate3d(0,${this.state.animations[i].interpolate({
											inputRange: [0, 1],
											outputRange: ["12px", "0px"]
										})},0)
										`
									};
									return (
									<div key={i} className="small-12 columns post-list">
										<Animated.div style={style}>
											<Link onClick={this.props.close} to={'/item/'+orderList.itemId}>
												<div className="post-list-l">
													<img src={orderList.itemPic} alt="" />
												</div>
												<div className="post-list-r">
													<h3>{orderList.itemName}</h3>
													<p className="time">Track ID :{orderList.itemId.slice(1,orderList.itemId.length)}<span>Complete : {orderList.itemWinTime}</span></p>
													<p className="price">{orderList.itemPrice}<span className="curentcy">Bath</span></p>
													<i className="fa fa-shopping-basket fa-2x"></i>
												</div>
											</Link>
										</Animated.div>
									</div>
									);
								})}
						</TransitionGroup>
					</div>
					<div className="small-12 large-6 columns post-feed post-feed-checkout">
						<div className="small-12 columns post-checkout">
							<h3>Your Order	</h3>
							<p className="desc">Payment Pending</p><br/>
							<Link onClick={this.handleLinktoCheckOut} to="/checkout" className="button success">Checkout</Link>
							<ul>
								<li>Your Order {this.state.orderLists.length} Item<span>{this.state.orderPrice} THB</span></li>
								{ this.state.orderPrice ?
								<li>Delivery Charge<span>39 THB</span></li> :
								<li>Delivery Charge<span>0 THB</span></li>
								}
							</ul>
							<hr/>
							<ul>
								{ this.state.orderPrice ?
								<li className="price">Total<span>{this.state.orderPrice + 39} THB</span><p>(VAT incl.)</p></li> :
								<li className="price">Total<span>0 THB</span><p>(VAT incl.)</p></li>
								}
							</ul>
						</div>
						<div className="small-12 columns post-checkout" style={{background:'#fff'}}>
							<div className="desc-box">
								<p><i className="fa fa-truck fa-2x"> </i> Get Your Order, 1-2 Days Delivery</p>
							</div>
						</div>
					</div>
			</div>
		) : 
		<div className="row">
			<div className="page-404-chart page-404-container fade-animate">
				<div className="page-404">
					<p className="quote">Your shopping cart was empty list !!</p>
					<Link to="/" onClick={this.props.close} className="button success">Just Auction</Link>
				</div>
			</div>
		</div>
	}
}	


