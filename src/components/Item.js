import React, { Component } from "react";
import Loading from './Loading'
import Clock from './Clock'
import BidForm from './BidForm'
import firebase from 'firebase'

export default class Item extends Component {
	state = {
		item:[],
		bidLists:[],
		newcurrent:[],
		timeNow:null,
		seeAutoBid:false,
		wait:false
	}

	componentDidMount() {
		this._filterItems(this.props.items,this.props.current);
			firebase.database().ref('/items/'+this.props.match.params.id+'/bidList').orderByChild('bid').on('value', Snapshot => {
				let table_ = []
				Snapshot.forEach( childSnapshot => {
				let data = childSnapshot.val()
				data['name'] = data.userName
				table_.push(data)
			})

			if(this.state) {				
				this.setState({bidLists:table_.reverse()})
			}

		})
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._filterItems(nextProps.items,nextProps.current);
		}
		if (this.props.current !== nextProps.current) {
			this._filtercurrent(this.props.current,nextProps.current)
		}
		if (this.props.timeNows !== nextProps.timeNows) {
			this._filtertimeNows(this.props.timeNows,nextProps.timeNows)
		}
	}

	_filterItems = (items,currents) => {
		let item = items.filter( item => {
			return item._id === this.props.match.params.id
		})
		let newcurrent = currents.filter( current => {
			return current.itemId === this.props.match.params.id
		})
		newcurrent.length !== 0 && this.setState({newcurrent: newcurrent[0].current})
		if(item){
			item.length !== 0 ? this.setState({item: item}) : this.props.history.push('/')
		}
	}

	_filtercurrent = (items,currents) => {
		let newcurrent = currents.filter( current => {
			return current.itemId === this.props.match.params.id
		})
		newcurrent.length !== 0 && this.setState({newcurrent: newcurrent[0].current})
	}

	_filtertimeNows = (timeNows) => {
		let newtimeNows = timeNows.filter( timeNow => {
			return timeNow._id === this.props.match.params.id
		})
		newtimeNows.length !== 0 && this.setState({timeNow: newtimeNows[0].timeNow})
	}
                 
	recieve = () => {
		this.setState({wait:false})
	} 

	waiting = () => {
		this.setState({wait:true})
	}

	toggleAutoBid = () => {
		this.setState({seeAutoBid:!this.state.seeAutoBid})
	}

	render() {
		return this.state.item[0] ? (
			<div>
				<div className="row auct-content">
					<div className="small-9 columns">
						<h1>{this.state.item[0].name}</h1>
						<p className="p-desc">{this.state.item[0].desc.short}</p>
					</div>
					<div className="small-3 columns">
						{ this.state.newcurrent !== 0 &&
							<p className="price">{this.state.newcurrent}<span className="curentcy">Bath</span></p>
						}
					</div>
				</div>
				<div>
					<div className="small-12 medium-5 large-6 columns auct-l-container">
						<div className="item-warper">
							<div className="item">
								<img src={this.state.item[0].img} alt=""/>
							</div>
						</div>
					</div>
					<div className="small-12 medium-7 large-6 columns auct-r-container">
						<div className="auct-content">
							<div className="row auct-from-warp">
								<div className="small-5 medium-5 columns">
									<p className="time">Time Remaining<br></br>
									{this.state.timeNow !== null &&
										<Clock secondsToHms={this.props.secondsToHms} timeNow={this.state.timeNow}/>
									}
									</p>
								</div>
								{ this.props.isLogin &&
									<div className="small-7 medium-7 columns auct-from-bit">
										<p className="time">Place Your Bid</p>
										<BidForm recieve={this.recieve} waiting={this.waiting} wait={this.state.wait} newcurrent={this.state.newcurrent} open={this.props.triggler} item={this.state.item[0]} params={this.props.match.params.id} />
										{ this.state.newcurrent !== 0 &&
											<p className="helper">Bids More Than {this.state.newcurrent}฿ To Win This Auction</p>
										}
									</div>
								}
							</div>
							<div className="row auct-from-warp">
								<div className="small-12 medium-12 columns">
									<p className="time">Bidding List</p>
									<div className="tableWarp">
									<table className="hover unstriped">
										<tbody>
											{ this.state.bidLists.map( (bidList,i) => {
												let bidLenght = this.state.bidLists.length - 1
											return	<tr key={i} className={"bidList " + (bidList.auto === 2 ? 'bidList-none ' : '') + ((this.state.seeAutoBid && bidList.auto >= 2) ? 'bidList-show' : '')} >
													<td width="25">{i === 0 && <i className="fa fa-trophy"></i>}</td>
													<td width="125" style={{textAlign:"left"}}>{i !== bidLenght  ? (bidList.name).slice(0,-2) + ' ⁎⁎⁎' : bidList.name}<span className='bidList-auto'>{bidList.auto === 1 || bidList.auto === 2 ? '(auto)' : ''}{(this.state.seeAutoBid && bidList.auto === 3) ? '(auto)' : ''}</span></td>
													<td width="50" title={(bidList.auto === 3 ? 'max bid is lost.' : '')+ (bidList.auto === 2 ? ' auto bid.' : '')} style={{textAlign:"right"}}>{bidList.bid}.00<span>฿</span></td>
													<td width="150" title={this.props.convertTimeM(bidList.bidTimestamp)} style={{fontSize:"0.66em"}}>{this.props.convertTime(bidList.bidTimestamp)}</td>
												</tr>
											})}
										</tbody>
									</table> 
									</div>
									<button className="toggleAutoBid" onClick={this.toggleAutoBid}><i className={"fa " +(this.state.seeAutoBid ? 'fa-eye-slash' : 'fa-eye')} aria-hidden="true"></i> auto bids</button>
								</div>
							</div>
							<div className="row auct-from-markdown">
								<div className="small-12 medium-12 columns">
									<h3>{this.state.item[0].desc.fullHeader}</h3>
									<p>{this.state.item[0].desc.fullDesc}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		) : <Loading />
	}
}

