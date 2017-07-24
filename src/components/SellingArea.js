import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { Link } from 'react-router-dom'

export default class SellingArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			animations: []
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.items);
	}
	
	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._renderProjects(nextProps.items);
		}
	}

	// Animation Logic
	_renderProjects(items) {
		this.setState(
			{
				items: items,
				animations: items.map((_, i) => new Animated.Value(0))
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

	handleClose = () => {
		this.props.close()
		window.scrollTo(0,0);
	}

	timeDiff = (timestamp1, timestamp2) => {
		let difference = timestamp1 - timestamp2;
		let daysDifference = Math.floor(difference/1000/60/60/24);
		return new Date(daysDifference * 1e3).toISOString().slice(-13, -5);
	}

	render() {
		return (
			<div className="page items post-feed">
				<TransitionGroup>
					{this.state.items.map((p, i) => {
						const style = {
							opacity: this.state.animations[i],
							transform: Animated.template`
								translate3d(0,${this.state.animations[i].interpolate({
								inputRange: [0, 1],
								outputRange: ["12px", "0px"]
							})},0)
							`
						};
						let Magic = this.timeDiff(this.state.items[i].bid.endTime,this.state.items[i].bid.startTime)
						return (
						<div key={i} className="small-6 medium-4 large-3 columns post-box">
							<Animated.div style={style}>
								<Link onClick={this.handleClose} to={'/item/'+ this.state.items[i]._id}>
									<div className="post-box-top">
										<img src={this.props.dummyimage} alt=""/>
									</div>
									<div className="post-box-content">
										<h3>{this.state.items[i].name}</h3>
										<p className="desc">{this.state.items[i].desc.short}</p>
										<span className="timecount red">{Magic}</span>
										<p className="price">{this.state.items[i].bid.openBid}<span className="curentcy">Bath</span></p>
										<button><i className="fa fa2x "></i></button>
									</div>
								</Link>
							</Animated.div>
						</div>
						);
					})}
				</TransitionGroup>
			</div>
		);
	}
}

SellingArea.defaultProps = {dummyimage:'http://dummyimage.com/300x300/292929/e3e3e3&text=Your Mom Goes to College'}
