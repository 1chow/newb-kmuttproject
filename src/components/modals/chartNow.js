import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as Animated from "animated/lib/targets/react-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import Clock from '../Clock'

class chartNow extends Component {
    state = {
        items: [],
        animations: [],
        newcurrent:[],
		timeNows:[],
    }

    componentDidMount() {
		this.setState({chartNow: this.props.chartNow},() => {
			if(this.state.chartNow){
				this._renderProjects(this.props.items)
				this._filtercurrent(this.props.current)
				this._filtertimeNows(this.props.timeNows)
			}
		})
	}
    
    componentWillReceiveProps(nextProps) {
		if(nextProps.items) {
			if(this.state.items.length !== nextProps.items.filter( item => item.isActive !== 0).length){
				this._renderDelete(nextProps.items)
				this._filtertimeNows(nextProps.timeNows)
				this._filtercurrent(nextProps.current)
			} else this._renderDelete(nextProps.items)
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
			return item.isActive !== 0 && item.isDelete === 1
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
			return item.isActive !== 0 && item.isDelete === 1
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
			return current.isActive !== 0 && current.isDelete === 1
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
			return timeNow.isActive !== 0 && timeNow.isDelete === 1
		})
		let newtimenows = filterTimeNows.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
        newtimenows.length !== 0 && this.setState({timeNows: newtimenows})
	}

    render() {

		let {chartNow} = this.props

        return (this.state.chartNow && this.state.items.length !== 0 ) ? (
        	<div className="page items post-feed">
        		<p className="modal-chart-now-desc">Your currently active bid</p>
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
                                        <p className="desc">{item.desc.short.slice(0,100)}..</p>
                                        <Clock secondsToHms={this.props.secondsToHms} timeNows={this.state.timeNows[i]}  />
                                        { this.state.newcurrent[i] && 
                                            <p className="price"><span className="curentcy">฿</span>{this.state.newcurrent[i].current}<span className="curentcy dot">.00</span></p>
                                        }
                                        { this.state.newcurrent[i].own === this.props.userUID ?
                                        <p className="modal-chart-now-status" style={{color : '#1B5E20',background : '#B9F6CA'}}><i className="fa fa-clock-o "></i> now you win</p>
                                        : <p className="modal-chart-now-status" style={{color : '#cc4b37',background : '#ffdad5'}}><i className="fa fa-clock-o "></i> now you lost</p>
                                   		 }
                                    </div>
                                </Link>
                            </Animated.div>
                        </div>
						)
					})}
				</TransitionGroup>
			</div>

        ) : this.props.items.filter( item => (item.isActive !== 0 && chartNow.indexOf(item._id) !== -1).length === 0 && item.isDelete === 1) ?

		<div className="row">
			<div className="page-404-chart page-404-container fade-animate">
				<div className="page-404 ">
					<p className="quote">Your current bidding was empty list !!</p>
					<Link to="/" onClick={this.props.close} className="button success">Just Auction</Link>
				</div>
			</div>
		</div> : null
    }
}

export default chartNow
