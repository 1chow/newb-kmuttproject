import React, { Component } from "react";
import * as Animated from "animated/lib/targets/react-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import Sellingarea from './Sellingarea'

export default class Sellingareas extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			animations: [],
			newcurrent:[],
			timeNows:[],
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.items,this.props.isActive)
	}
	
	//For First Render
	componentWillReceiveProps(nextProps) {
		if(nextProps.items) {
			if(this.state.items.length !== nextProps.items.filter( item => item.isActive !== 0).length){
				this._renderDelete(nextProps.items,nextProps.isActive)
				this._filtertimeNows(nextProps.timeNows,this.props.isActive)
				this._filtercurrent(nextProps.current,this.props.isActive)
			} else this._renderDelete(nextProps.items,nextProps.isActive)
		}
		if (this.props.items.length !== nextProps.items.length) {
			this._renderProjects(nextProps.items,nextProps.isActive);
		}
		if (nextProps.current.length !== 0) {
			this._filtercurrent(nextProps.current,this.props.isActive)
		}
		if (nextProps.timeNows.length !== 0) {
			this._filtertimeNows(nextProps.timeNows,this.props.isActive)
		}
	}

	// Animation Logic
	_renderProjects(items,isActive,currents) {
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive !== 0
		})
		if(isActive !== 'default') {
		var newitems = filterItems.filter( item => {
			return item.catagory === isActive
		})} else newitems = filterItems
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

	_renderDelete(items,isActive,currents) {
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive !== 0
		})
		if(isActive !== 'default') {
		var newitems = filterItems.filter( item => {
			return item.catagory === isActive
		})} else newitems = filterItems
		this.setState(
			{
				items: newitems,
			}
		)
	}

	//
	_filtercurrent = (currents,isActive) => {
		let sortCurrents = currents.sort(function(a, b){
			return a.endTime-b.endTime
		})
		let filterCurrents = sortCurrents.filter( current => {
			return current.isActive !== 0
		})
		if(currents.length !== 0) {
			if(isActive !== 'default') {
			var newcurrent = filterCurrents.filter( current => {
				return current.catagory === isActive
			}) 
			} else newcurrent = filterCurrents
		}  newcurrent.length !== null && this.setState({newcurrent: newcurrent})
	}

	_filtertimeNows = (timeNows,isActive) => {
		let sortTimeNows = timeNows.sort(function(a, b){
			return a.endTime-b.endTime
		})
		let filterTimeNows = sortTimeNows.filter( timeNow => {
			return timeNow.isActive !== 0
		})
		if(timeNows.length !== 0) {
			if(isActive !== 'default') {
			var newtimeNows = filterTimeNows.filter( timeNow => {
				return timeNow.catagory === isActive
			}) 
			} else newtimeNows = filterTimeNows
		} timeNows.length !== 0 && this.setState({timeNows: newtimeNows})
	}

	handleClose = () => {
		this.props.close()
		window.scrollTo(0,0);
	}

	handleHeight = () => {
		
	}

	render() {
		return (
			<div className="page items post-feed">
				<TransitionGroup>
					{this.state.items.map((item, i) => {
						let style = {}
						if(this.state.animations[i] === undefined){
							style = {
								opacity: this.state.animations[i],
							};
						} else {
							style = {
								opacity: this.state.animations[i],
								transform: Animated.template`
									translate3d(0,${this.state.animations[i].interpolate({
									inputRange: [0, 1],
									outputRange: ["6px", "0px"]
								})},0)
								`
							}
						}
						return this.state.newcurrent[i] ? (
						<Sellingarea 
							key={i}
							handleClose={this.handleClose}
							style={style}
							item={item}
							timeNows={this.state.timeNows[i]}
							current={this.state.newcurrent[i].current}
							secondsToHms={this.props.secondsToHms}
							priceFormat={this.props.priceFormat}
						/>
						) : null
					})}
				</TransitionGroup>
			</div>
		)
	}
}

