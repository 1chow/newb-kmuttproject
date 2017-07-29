import React, { Component } from "react";
import Loading from './Loading'
import Clock from './Clock'
import BidForm from './BidForm'
import Allinone from './modals/Modal-All'
import firebase from 'firebase'

export default class Item extends Component {
	state = {
		item:[],
		bidLists:[],
		current : [],
		feel:null,
		message: null,
	}

	componentDidMount() {
		this._filterItems(this.props.items);
		firebase.database().ref('/items/'+this.props.match.params.id+'/bidList').on('value', Snapshot => {
			let table_ = []
			Snapshot.forEach( childSnapshot => {
			let data = childSnapshot.val();
			table_.push(data)
			})
			if(this.state)				
			this.setState({bidLists:table_.reverse()})
		})
		firebase.database().ref('/items').on('value', Snapshot => {
	        let current_a = [];

	        Snapshot.forEach( childSnapshot => {
			  let data = childSnapshot.val();
			  let key = childSnapshot.key;
	          let current_ = data.bid.current;
	          let obj = {
	          	current  : current_,
	          	itemId : key
	          }
	          current_a.push(obj);

			})
		    this.setState({current:current_a})
		  })
		this._filterCurrent(this.state.current);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._filterItems(nextProps.items);
		}
	}

	_filterItems = (items) => {
		let item = items.filter( item => {
			return item._id === this.props.match.params.id
		})
		if(item){
			item.length !== 0 && this.setState({item: item})
		}
	}

	_filterCurrent = (currents) => {
		let current = currents.filter( current => {
			return current.itemId === this.props.match.params.id
		})
		if(current){
			current.length !== 0 && this.setState({current: current})
		}
	}

	trigg = ( feel , message ) => {
		this.setState({message: message})
		this.setState({feel:feel})
	}

	untrigg = () => {
		this.setState({message: null})
		this.setState({feel:null})
	}

	render() {
		return this.state.item[0] ? (
			<div>
				{this.state.feel ? <Allinone feel={this.state.feel} message={this.state.message} close={this.untrigg} /> : null}
				<div className="row auct-content">
					<div className="small-9 columns">
						<h1>{this.state.item[0].name}</h1>
						<p className="show-for-medium">{this.state.item[0].desc.short}</p>
					</div>
					<div className="small-3 columns">
						<p className="price">{this.state.item[0].bid.current}<span className="curentcy">Bath</span></p>
					</div>
				</div>
				<div className="row ">
					<div className="small-12 medium-5 large-7 columns auct-l-container">
						<div className="item-warper">
							<div className="item">
								<img src={require("../images/mockup.JPG")} alt=""></img>
							</div>
						</div>
				</div>
					<div className="small-12 medium-7 large-5 columns auct-r-container">
						<div className="auct-content">
							<div className="row auct-from-warp">
								<div className="small-5 medium-5 columns">
									<p className="time">Time Remaining<br></br><Clock  item={this.state.item[0]} /></p>
								</div>
								<div className="small-7 medium-7 columns auct-from-bit">
									<p className="time">Place Your Bid</p>
									<BidForm open={this.trigg} item={this.state.item[0]} params={this.props.match.params.id} />
									<p className="helper">Bids More Than {this.state.item[0].bid.current}฿ To Win This Auction</p>
								</div>
							</div>
							<div className="row auct-from-warp">
								<div className="small-12 medium-12 columns">
									<p className="time">Bidding List</p>
									<table className="hover unstriped">
										<tbody>
											{ this.state.bidLists.map( (bidList,i) => {
											return	<tr key={i}>
													<td>{bidList.userId}</td>
													<td>{bidList.bid}<span>THB</span></td>
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

Item.defaultProps = {dummyimage:'http://lorempixel.com/700/600/'}
