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
		itemImage:0,
		selected: [],
		isActive:null,
		own:null,
	}

	componentDidMount() {
		this._filterItems(this.props.items,this.props.current)
		this._filtercurrent('',this.props.current)
		this.handleMsg('default','','','')

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
			 this.handleMsg('anonymusUser','','','')	
		} else if(this.state.isActive !== 0 && this.state.isMsg !==1){
		 	this.handleMsg('default','','','')
		}

		if (nextProps.items.length) {
			this._filterItems(nextProps.items,nextProps.current);
		}
		if (this.props.current !== nextProps.current) {
			this._filtercurrent(this.props.current,nextProps.current)
		}
		if (this.props.timeNows !== nextProps.timeNows) {
			this._filtertimeNows(this.props.timeNows,nextProps.timeNows,nextProps.isLogin)
		}
		if(this.props.userUID !== nextProps.userUID && nextProps.userUID.lenght !== 0){
			this._filtercurrent(this.props.current,nextProps.current)
		}
	}

	updateStatus = (tableUser,own,maxBid,current) => {
		let length = tableUser.length
		if(length === 0){
			this.handleMsg('default','','','')
		} else {
			if(this.props.userUID === own){
				this.handleMsg('maxBid',maxBid,'','')
			} else {
				let lowerBid = current + this.state.bidStep_
				this.handleMsg('lostBid',tableUser[0].bid,lowerBid,'')
			}
		}
	}

	_filterItems = (items,currents) => {
		let item = items.filter( item => {
			return item._id === this.props.match.params.id
		})
		let newcurrent = currents.filter( current => {
			return current.itemId === this.props.match.params.id
		})
		newcurrent.length !== 0 && this.setState({newcurrent: newcurrent[0].current,own:newcurrent[0].own})
		if(item){
			item.length !== 0 ? this.setState({item: item}) : this.props.history.push('/')
		}
	}

	_filtercurrent = (items,currents) => {
		let newcurrent = currents.filter( current => {
			
			return current.itemId === this.props.match.params.id
		})

		if (newcurrent[0] !== null){
			
			this.setState({newcurrent: newcurrent[0].current,own:newcurrent[0].own},() => {
				if(this.state.bidLists && this.props.userUID){
					let tableUser = this.state.bidLists.filter( table => {
						return this.props.userUID === table.userId && table.userId !== ''
					})
					this.updateStatus(tableUser,this.state.own,newcurrent[0].maxBid,newcurrent[0].current)
				}
			})
			

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
			this.setState({bidIcon:'sign-in',
					bidColor_bg:'#B9F6CA',
					bidColor_icon:'#ffae00',
					bidColor:'#1B5E20',
					bidResult: 'Log in to join',
					bidResult_: 'Please log in to try wins this auctions.'
			})
			break
			case'timeOut' :
			this.setState({bidIcon:'clock-o',
					bidColor_bg:'#ffdad5',
					bidColor_icon:'#cc4b37',
					bidColor:'#cc4b37',
					bidResult: 'Ended Auctions',
					bidResult_: 'Thank for your interest in this auction.'
			})
			break
			case'lost' :
				this.setState({
					bidIcon:c,
					bidColor_bg:'#ffdad5',
					bidColor_icon:'#cc4b37',
					bidColor:'#cc4b37',
					bidResult: a,
					bidResult_: b,
					isMsg : 1
				})
				this.timeout = setTimeout( () => {
				let tableUser = this.state.bidLists.filter( table => {
					return this.props.userUID === table.userId && table.userId !== ''
				})
				let lowerbid = this.state.newcurrent + this.state.bidStep_
				this.handleMsg('lostBid',tableUser[0].bid,lowerbid,'')
		      	},10000)
			break
			case'win' :
				this.setState({bidIcon:c,
					bidColor_bg:'#B9F6CA',
					bidColor_icon:'#ffae00',
					bidColor:'#1B5E20',
					bidResult: a,
					bidResult_: b,
					isMsg : 1
				})
			break
			case'maxBid' :
				this.setState({bidIcon:'trophy',
					bidColor_bg:'#B9F6CA',
					bidColor_icon:'#ffae00',
					bidColor:'#1B5E20',
					bidResult: 'Max bid at ' + a + ' ฿',
					bidResult_: 'You are currently the highest bidder.',
					isMsg : 1
				})
			break
			case'lostBid' :
				this.setState({bidIcon:'exclamation',
					bidColor_bg:'#ffdad5',
					bidColor_icon:'#cc4b37',
					bidColor:'#cc4b37',
					bidResult: 'You lost bid at ' + a + ' ฿',
					bidResult_: 'Try Place Your high bid than '+ b,
					isMsg : 1
				})
			break
			default :
				this.setState({
					bidIcon:'gavel',
					bidColor_bg:'#f0f0f0',
					bidColor_icon:'#126195',
					bidColor:'#126195',
					bidResult:'Really want to win?',
					bidResult_:'Try Place Your high bid amount.'
				})
			break
		}

	}

	ImgToggle = (num) => {

		this.setState({itemImage: num})

	}

	componentWillUnmount() {
		firebase.database().ref('/items/'+this.props.match.params.id+'/bidList').orderByChild('bid').off();
		if (this.timeout) {
			clearTimeout(this.timeout)
		}
	}

	conditionDetail = type => {
		switch(type){
			case'New' :
			    return "A brand-new, unused, unopened, undamaged item in its original packaging (where packaging is applicable). Packaging should be the same as what is found in a retail store, unless the item is handmade or was packaged by the manufacturer in non-retail packaging, such as an unprinted box or plastic bag. See the seller's listing for full details."
			case'Used' : 
				return "An item that has been used previously. The item may have some signs of cosmetic wear, but is fully operational and functions as intended. This item may be a floor model or store return that has been used. See the seller's listing for full details and description of any imperfections."
			case'Manufacturer refurbished' : 
				return "An item that has been professionally restored to working order by a manufacturer or manufacturer-approved vendor. This means the product has been inspected, cleaned, and repaired to meet manufacturer specifications and is in excellent condition. This item may or may not be in the original packaging. See the seller's listing for full details."
			default :
				return "No condition"
		}
	}

	render() {

		return this.state.isActive !== null ? (

			<div>

				<div className="row auct-content">
					<div className="small-9 columns">
						<h1>{this.state.item[0].name}</h1>
						<p className="p-desc p-sub-desc">{this.state.item[0].desc.short}</p>
					</div>
					<div className="small-3 columns">
						{ this.state.newcurrent !== 0 &&
							<p className="price"><span className="curentcy">฿</span>{this.props.priceFormat(this.state.newcurrent)}<span className="curentcy dot">.00</span></p>
						}
						<p className="helper auct-text-current text-right show-for-medium">Current Bids</p>
					</div>
				</div>

				<div className="small-12 medium-7 large-6 columns auct-l-container">
					<div className="item-warper">
						<div className="item">
							<img src={this.state.item[0].img_[this.state.itemImage]} alt=""/>
						</div>
						<div className="item-box-list">

							{ this.state.item[0].img_.map( (img,i) => {
								return <img key={i} className={this.state.itemImage === i ? 'active' : ''} src={img} onClick={() => this.ImgToggle(i)} alt=""/>
							})}

						</div>
					</div>
					<div className="small-12 columns">
						<div className="auct-from-markdown">
							<div className="small-12 medium-12 columns auct-spec-container">
								<h3>Item specifics</h3>
								<ul className="auct-spec" >
									{ this.state.item[0].spec.map((spec,i) => {
										if(spec.name === 'Condition') {
											return	<li key={i} ><p className="auct-spec-name">{spec.name}</p> : <p className="auct-spec-detail">{this.conditionDetail(spec.detail)}</p></li>
										} else {
											return	<li key={i} ><p className="auct-spec-name">{spec.name}</p> : <p className="auct-spec-detail">{spec.detail}</p></li>
										}
									})}
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="small-12 medium-5 large-6 columns auct-r-container">
					<div className="auct-content">
						{ this.state.isActive !== 0 &&
							<div className="row auct-from-warp">
								<div className="medium-12 large-6 columns">
									<p className="time">Time Left</p>
									<div className="auct-from-time">
										{this.state.timeNow !== null &&
											<div> 
												<Clock secondsToHms={this.props.secondsToHms} timeNow={this.state.timeNow-1}/>
												<p className="helper">Time Current : Bangkok (UTC + 7)</p>
											</div> 
										}
									</div>
								</div>
								{this.props.isLogin ?
								<div className="medium-12 large-6 columns auct-from-bit">
									<p className="time">Place Your Bid</p>
									<BidForm recieve={this.recieve} msg={this.handleMsg} waiting={this.waiting} wait={this.state.wait} newcurrent={this.state.newcurrent} mfkCurrent={this.props.current} open={this.props.triggler} item={this.state.item[0]} params={this.props.match.params.id} bidStep_={this.state.bidStep_} />
									{ this.props.userUID !== this.state.own ?
										<p className="helper">Minimum Incress Bidding ฿{this.state.bidStep_ }.<br/>Please Enter ฿ {this.state.newcurrent + this.state.bidStep_ } or more.</p>
										:
										<p className="helper">Your Max Bids ฿ {this.state.maxBid}.00</p>
									}
								</div> 
								: 
								<div className="small-6 medium-6 columns auct-from-bit">
									
								</div> 
								}
						</div>
						}

						<div className="row auct-from-warp">
							<div className="medium-12 large-6 columns auct-from-text">
								<p className="auct-text"><i className="fa fa-calendar"></i> Duration</p>
								<p className="auct-text-sub">{this.props.convertDuration(this.state.item[0].bid.startTime,this.state.item[0].bid.endTime)}</p>
							</div>
							<div className="medium-12 large-6 columns auct-from-text">
								<p className="auct-text"><i className="fa fa-clock-o"></i> Ending Time</p>
								<p className="auct-text-sub">{this.props.convertTime(this.state.item[0].bid.endTime)} (UTC+7)</p>
							</div>
						</div>

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
												<td width="125" style={{textAlign:"left"}}>{i !== bidLenght  ? '⁎ ' + (bidList.name).slice(1,-1) + ' ⁎' : bidList.name}<span className='bidList-auto'>{bidList.auto === 1 || bidList.auto === 2 ? '(auto)' : ''}{(this.state.seeAutoBid && bidList.auto === 3) ? '(auto)' : ''}</span></td>
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

					</div>
				</div>

				<div className="small-12 columns">
					<div className="auct-from-markdown">
						<div className="small-12 medium-12 columns">
							<h3>{this.state.item[0].desc.fullHeader}</h3>
							<div dangerouslySetInnerHTML= {{__html: this.state.item[0].desc.fullDesc.toString('html').replace(/ /g, "\u00a0")}} />
						</div>
					</div>
				</div>

			</div>
		) : <Loading />
	}
}

