import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { Link } from 'react-router-dom'
import Clock from './Clock'

export default class Sellingareas extends Component {
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

	render() {
		return (
			<div className="page items post-feed">
				<TransitionGroup>
					{this.state.items.map((item, i) => {
						const style = {
							opacity: this.state.animations[i],
							transform: Animated.template`
								translate3d(0,${this.state.animations[i].interpolate({
								inputRange: [0, 1],
								outputRange: ["12px", "0px"]
							})},0)
							`
						};
						return item.isActive === 1 ? (
						<div key={i} className="small-6 medium-4 large-3 columns post-box">
							<Animated.div style={style}>
								<Link onClick={this.handleClose} to={'/item/'+ item._id}>
									<div className="post-box-top">
										<img src={require("../images/mockup.JPG")} alt=""></img>
									</div>
									<div className="post-box-content">
										<h3>{item.name}</h3>
										<p className="desc">{item.desc.short}</p>
										<Clock item={item}  />
										<p className="price">{this.props.current[i]}<span className="curentcy">Bath</span></p>
										<button><i className="fa fa2x "></i></button>
									</div>
								</Link>
							</Animated.div>
						</div>
						) : null
					})}
				</TransitionGroup>
			</div>
		) 
	}
}

Sellingareas.defaultProps = {dummyimage:'http://dummyimage.com/300x300/292929/e3e3e3&text=Your Mom Goes to College'}
