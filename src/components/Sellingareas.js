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
			animations: [],
			newcurrent:[],
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.items,this.props.isActive)
	}
	
	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._renderProjects(nextProps.items,nextProps.isActive);
		}
		//
		if (nextProps.current.length !== 0) {
			this._filtercurrent(nextProps.current,this.props.isActive)
		}
	}

	// Animation Logic
	_renderProjects(items,isActive,currents) {
		if(isActive !== 'default') {
		var newitems = items.filter( item => {
			return item.catagory === isActive && item.isActive !== 0
		})} else newitems = items
		this.setState(
			{
				items: newitems,
				animations: newitems.map((_, i) => new Animated.Value(0))
			},
			() => {
				Animated.stagger(
					100,
					this.state.animations.map(anim =>
						Animated.spring(anim, { toValue: 1 })
					)
				).start();
			}
		)
	}

	//
	_filtercurrent = (currents,isActive) => {
		if(currents.length !== 0) {
			if(isActive !== 'default') {
			var newcurrent = currents.filter( current => {
				return current.catagory === isActive && current.isActive !== 0
			}) 
			} else newcurrent = currents
		}  newcurrent.length !== 0 && this.setState({newcurrent: newcurrent})
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
								outputRange: ["6px", "0px"]
							})},0)
							`
						};
						return this.state.newcurrent[i] ? (
						<div key={i} className={"small-6 medium-4 large-3 columns post-box "+(this.state.newcurrent[i].isActive === 0 && 'hidden')}>
							<Animated.div style={style}>
								<Link onClick={this.handleClose} to={'/item/'+ item._id}>
									<div className="post-box-top">
										<img src={item.img} alt=""/>
									</div>
									<div className="post-box-content">
										<h3>{item.name}</h3>
										<p className="desc">{item.desc.short.slice(0,20)}</p>
										<Clock item={item}  />
											<p className="price">{this.state.newcurrent[i].current}<span className="curentcy">Bath</span></p>
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

