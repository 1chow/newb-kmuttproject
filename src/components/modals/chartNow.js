import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Animated from "animated/lib/targets/react-dom"
import * as firebase from 'firebase'
import TransitionGroup from "react-transition-group/TransitionGroup"
import Clock from '../Clock'

class chartNow extends Component {
    state = {
        items: [],
        animations: [],
        newcurrent:[],
		timeNows:[],
		chartNow:[],
    }

    componentDidMount() {
		let user = firebase.auth().currentUser;
		if (user) {
			firebase.database().ref('/users/' + user.uid + '/now').on('value', dataSnapshot => {
				this.setState({chartNow: dataSnapshot.val()},() => {
					if(this.state.chartNow){
						this._renderProjects(this.props.items)
						this._filtercurrent(this.props.current)
						this._filtertimeNows(this.props.timeNows)
					}
				})
			})
		}
    }
    
    componentWillReceiveProps(nextProps) {
		if(nextProps.current && this.state.chartNow) {
			if(this.state.newcurrent.length !== nextProps.current.filter( current => current.isActive !== 0).length){
				this._renderDelete(nextProps.items)
				this._filtertimeNows(nextProps.timeNows)
				this._filtercurrent(nextProps.current)
			}
		}
		if (this.props.items.length !== nextProps.items.length && this.state.chartNow) {
			this._renderProjects(nextProps.items);
		}
		if (nextProps.current.length !== 0 && this.state.chartNow) {
			this._filtercurrent(nextProps.current)
		}
		if (nextProps.timeNows.length !== 0 && this.state.chartNow) {
			this._filtertimeNows(nextProps.timeNows)
		}
	}

	_renderDelete(items) {
		let {chartNow} = this.state
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive !== 0
		})
		let newitems = filterItems.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
		this.setState({
			items: newitems
		})
	}


    _renderProjects(items) {
		let {chartNow} = this.state
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive !== 0
		})
		let newitems = filterItems.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
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

	
	_filtercurrent = (currents) => {
		let {chartNow} = this.state
		let sortCurrents = currents.sort(function(a, b){
			return a.endTime-b.endTime
		})
		let filterCurrents = sortCurrents.filter( current => {
			return current.isActive !== 0
		})
		let newcurrents = filterCurrents.filter( a => {
			return chartNow.indexOf(a.itemId) !== -1
		})
        newcurrents.length !== null && this.setState({newcurrent: newcurrents})
	}

	_filtertimeNows = (timeNows) => {
		let {chartNow} = this.state
		let sortTimeNows = timeNows.sort(function(a, b){
			return a.endTime-b.endTime
		})
		let filterTimeNows = sortTimeNows.filter( timeNow => {
			return timeNow.isActive !== 0
		})
		let newtimenows = filterTimeNows.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
        newtimenows.length !== 0 && this.setState({timeNows: newtimenows})
	}

	componentWillUnmount() {
		let user = firebase.auth().currentUser;
		if (user) {
			firebase.database().ref('/users/' + user.uid + '/now').off()
		}
	}

    render() {
        return this.state.chartNow ? (
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
						return (
                        <div key={i} className="small-6 medium-4 large-3 columns post-box">
                            <Animated.div style={style}>
                                <Link onClick={this.props.close} to={'/item/'+ item._id} >
                                    <div className="post-box-top">
                                        <img src={item.img} alt=""/>
                                    </div>
                                    <div className="post-box-content">
                                        <h3>{item.name}</h3>
                                        <p className="desc">{item.desc.short.slice(0,20)}</p>
                                        <Clock secondsToHms={this.props.secondsToHms} timeNows={this.state.timeNows[i]}  />
                                        { this.state.newcurrent[i] && 
                                            <p className="price">{this.state.newcurrent[i].current}<span className="curentcy">Bath</span></p>
                                        }
                                        <button><i className="fa fa2x "></i></button>
                                    </div>
                                </Link>
                            </Animated.div>
                        </div>
						)
					})}
				</TransitionGroup>
			</div>
        ) : 
		<div className="row">
			<div className="page-404-container">
				<div className="page-404">
					<h3>Not Found</h3>
					<p className="quote">User was empty list</p>
					<Link to="/" onClick={this.props.close} className="button success">Just Auction</Link>
				</div>
			</div>
		</div>
    }
}

export default chartNow
