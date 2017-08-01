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
		wait:false
	}

	componentDidMount() {
		this._filterItems(this.props.items,this.props.current);
		firebase.database().ref('/items/'+this.props.match.params.id+'/bidList').on('value', Snapshot => {
			let table_ = []
			Snapshot.forEach( childSnapshot => {
			let data = childSnapshot.val();
			table_.push(data)
			})
			if(this.state)				
			this.setState({bidLists:table_.reverse()})
		})
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._filterItems(nextProps.items,nextProps.current);
		}
		if (this.props.current !== nextProps.current) {
			this._filtercurrent(this.props.current,nextProps.current)
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

	recieve = () => {
		this.setState({wait:false})
	} 

	waiting = () => {
		this.setState({wait:true})
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
									<p className="time">Time Remaining<br></br><Clock  item={this.state.item[0]} /></p>
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
									<table className="hover unstriped">
										<tbody>
											{ this.state.bidLists.map( (bidList,i) => {
											return	<tr key={i}>
													<td width="150">{bidList.userName}</td>
													<td width="75">{bidList.bid}<span>THB</span></td>
													<td width="75">{this.props.timeDiff(bidList.bidTimestamp)}</td>
												</tr>
											})}
										</tbody>
									</table>
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

