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
		bidStep_:'',
		timeNow: null,
		seeAutoBid:false,
		maxBid:'',
		wait:false,
		bidResult:'',
		bidResult_:'',
		bidIcon:'',
		isActive:null,
	}

	componentDidMount() {
		this._filterItems(this.props.items,this.props.current)
		this._filtercurrent('',this.props.current)

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
		if(nextProps.isLogin === false){
			this.handleMsg('anonymusUser')
		} else {
			if(this.state.isActive !== 0)
			 this.handleMsg('default','','','')
		}
		if (!this.props.items.length && nextProps.items.length) {
			this._filterItems(nextProps.items,nextProps.current);
		}
		if (this.props.current !== nextProps.current) {
			this._filtercurrent(this.props.current,nextProps.current)
		}
		if (this.props.timeNows !== nextProps.timeNows) {
			this._filtertimeNows(this.props.timeNows,nextProps.timeNows,nextProps.isLogin)
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

		if (newcurrent[0] !== null){

			this.setState({newcurrent: newcurrent[0].current})
			

			if (newcurrent[0].maxBid !== null) {

				this.setState({maxBid: newcurrent[0].maxBid})

				if ( newcurrent[0].maxBid < newcurrent[0].current){
					this.setState({bidStep_: 0})
				} else {
					this.setState({bidStep_: newcurrent[0].bidStep})
				}

			}

		} 


	}

	_filtertimeNows = (timeNows,anonymus,isLogin) => {
		let newtimeNows = timeNows.filter( timeNow => {
			return timeNow._id === this.props.match.params.id
		})
		if(newtimeNows.length !== 0) {
			this.setState({timeNow: newtimeNows[0].timeNow,isActive: newtimeNows[0].isActive},() => {
				if(isLogin === true){
					newtimeNows[0].isActive === 0 && this.handleMsg('timeOut')
				}
			})
		}
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

	handleMsg = (type,a,b,c) => {

		switch(type){
			case'default' :
				this.setState({
					bidIcon:'gavel',
					bidColor_bg:'#f0f0f0',
					bidColor_icon:'#126195',
					bidColor:'#126195',
					bidResult:'Really want to win?',
					bidResult_:'Try Place Your high bid amount.'
				})
			break
			case'anonymusUser' :
			this.setState({bidIcon:'exclamation',
				bidColor_bg:'#ffdad5',
				bidColor_icon:'#cc4b37',
				bidColor:'#cc4b37',
				bidResult: 'User not login',
				bidResult_: 'XXXXXXXXXXXXXXX'
			})
			break
			case'timeOut' :
			this.setState({bidIcon:'exclamation',
				bidColor_bg:'#ffdad5',
				bidColor_icon:'#cc4b37',
				bidColor:'#cc4b37',
				bidResult: 'Time Out',
				bidResult_: 'XXXXXXXXXXXXXXX'
			})
			break
			case'lost' :
				this.setState({
					bidIcon:c,
					bidColor_bg:'#ffdad5',
					bidColor_icon:'#cc4b37',
					bidColor:'#cc4b37',
					bidResult: a,
					bidResult_: b
				})
				setTimeout( () => {
		        this.handleMsg('default','','','')
		      	}, 5000)
			break
			case'win' :
				this.setState({bidIcon:c,
					bidColor_bg:'#B9F6CA',
					bidColor_icon:'#ffae00',
					bidColor:'#1B5E20',
					bidResult: a,
					bidResult_: b
				})
				setTimeout( () => {
		        this.handleMsg('default','','','')
		      	}, 5000)
			break
		}



	}

	componentWillUnmount() {
		firebase.database().ref('/items/'+this.props.match.params.id+'/bidList').orderByChild('bid').off();
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
							{ this.state.isActive === 1 &&
							<div className="row auct-from-warp">
								<div className="small-5 medium-5 columns">
									<p className="time">Time Remaining<br></br>
									{this.state.timeNow !== null &&
										<Clock secondsToHms={this.props.secondsToHms} timeNow={this.state.timeNow-1}/>
									}
									</p>
								</div>
								{this.props.isLogin ?
									<div className="small-7 medium-7 columns auct-from-bit">
										<p className="time">Place Your Bid</p>
										<BidForm recieve={this.recieve} msg={this.handleMsg} waiting={this.waiting} wait={this.state.wait} newcurrent={this.state.newcurrent} mfkCurrent={this.props.current} open={this.props.triggler} item={this.state.item[0]} params={this.props.match.params.id} bidStep_={this.state.bidStep_} />
										{ this.props.userUID !== this.state.item[0].bid.userId ?
											<p className="helper">Enter THB {this.state.newcurrent + this.state.bidStep_ } ฿ or more</p>
											:
											<p className="helper">Your Max Bids {this.state.maxBid} ฿</p>
										}
									</div> 
									: 
									<div className="small-7 medium-7 columns auct-from-bit">
										<p className="time">User not login</p>
									</div> 
								}
							</div>
							}
							<div className="row auct-from-warp auct-msg" style={{background : this.state.bidColor_bg}}>
								<div className="small-12 medium-12 columns auct-msg-col"  >
									<div className="auct-msg-l" style={{color : this.state.bidColor_icon}} >
										<i className={"fa fa-" + this.state.bidIcon} ></i>
									</div>
									<div className="auct-msg-r" style={{color : this.state.bidColor}} >
										<p className="auct-msg-p">{this.state.bidResult}<span>{this.state.bidResult_}</span></p>
									</div>
								</div>
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

