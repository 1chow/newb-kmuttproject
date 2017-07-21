import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { Link } from 'react-router-dom'

export default class ModalChartWin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			animations: []
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.projects);
	}
	
	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.projects.length && nextProps.projects.length) {
			this._renderProjects(nextProps.projects);
		}
	}

	// Animation Logic
	_renderProjects(projects) {
		this.setState(
			{
				projects: projects,
				animations: projects.map((_, i) => new Animated.Value(0))
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
	render() {
		return (
			<div className="row">
					<div className="small-12 large-6 columns post-feed win-list">
						<TransitionGroup>
								{this.state.projects.map((p, i) => {
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
											<Link to='/item/1'>
												<div className="post-list-l">
													<img src="http://placehold.it/300x300" alt="" />
												</div>
												<div className="post-list-r">
													<h3>Lorem Ipsum</h3>
													<p className="desc">350มล.</p>
													<p className="time">asdfghjkloiuyt<span>00:00:00 01/01/01</span></p>
													<p className="price">999<span className="curentcy">Bath</span></p>
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
								<h3>Your Order</h3>
								<p className="desc">Payment Pending</p><br/>
								<Link to="/" className="button success">Checkout</Link>
								<ul>
									<li>Your Order 4 Item<span>999 THB</span></li>
									<li>Delivery Charge<span>39 THB</span></li>
								</ul>
								<hr/>
								<ul>
									<li className="price">Total<span>9,999 THB</span><p>(VAT incl.)</p></li>
								</ul>
							</div>
							<div className="small-12 columns post-checkout" style={{background:'#fff'}}>
								<div className="desc-box">
									<p><i className="fa fa-truck fa-2x"> </i> Get Your Order, 1-2 Days Delivery</p>
								</div>
							</div>
						</div>
			</div>
		);
	}
}	


