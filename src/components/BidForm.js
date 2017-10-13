import React, { Component } from 'react'
import { firebaseAuth } from '../helpers/firebase'

class bidForm extends Component {

	state = {
		validates:[],
		current: '',
		bidStep: this.props.item.bid.bidStep,		
	}

	componentDidMount() {

			this.bid.value = this.props.newcurrent + this.props.bidStep_

	}

	componentDidUpdate(prevProps, prevState) {
		this.state.validates !== prevState.validates &&
		this.Validation(this.props.item,this.props.params,this.state.current,this.props.open,this.props.msg,this.state.validates.endTime,this.state.validates.isActive,this.props.newcurrent)
	}

	componentWillReceiveProps(nextProps) {

		if (this.props.mfkCurrent !== nextProps.mfkCurrent) {
			this.bid.value = this.props.newcurrent + this.props.bidStep_
		}

	}


    Validation = (oldItem,itemId,current,open,msg,endTime,life,validatecurrent) => {
		var user = firebaseAuth().currentUser
		if (user) {
			let userId = user.uid
			let postBid = "https://us-central1-auctkmutt.cloudfunctions.net/bidOrder?itemId="+itemId+"&bid="+current+"&uId="+userId
			fetch(postBid)
			.then( response => {
				return response.json();
			  })
			.then( data => {
				this.props.recieve()
				this.setState({bidStep_:this.state.bidStep})
				this.bid.value = this.props.newcurrent + this.state.bidStep
				switch(data[0]) {
					case 'win':
						//open('alert','good','Win','fa-check-circle')
						msg('win','Your bid has been registered','You are currently the highest bidder.','trophy','trophy')
						break
					case 'loser':
						//open('alert','bad','Lost','fa-thumbs-down')
						msg('lost','Your bid Lost !','Next minimum bid is ' + (this.props.newcurrent + this.state.bidStep) + '฿','times')
						break
					case 'autoBid':
						//open('alert','bad','Less Than Open Bid','fa-thumbs-down')
						msg('lost','Please Try Agin !','Auto­bid from another was higher than yours.','times')
						break
					case 'alreadywin':
						//open('alert','bad','Less Than Open Bid','fa-thumbs-down')
						msg('lost','Now you already win !','You are currently the highest bidder.','exclamation')
						break	
					case 'increase':
						//open('alert','bad',data[0],'fa-thumbs-down')
						msg('win','You inscress bid !','Now you add acceptable maximum bid','arrow-up')
						break
					default :
						open('alert','bad',data[0],'fa-exclamation-triangle')
						msg('default','','','')
						break
				}
			  })
			.catch( err => err && open('alert','bad','Unfortunately <br> Bad Request please try agin','fa-thumbs-down'))
		} else open('alert','bad','Please Log In','fa-thumbs-down')
	}

	isBidForm = (bid,open) => {
		if(bid.value.length >= 10 || bid.value <= 0 || bid.value === 'e' || bid.value%Math.floor(bid.value) !== 0) {
			this.props.recieve()
			this.setState({bidStep_:this.state.bidStep})
			this.bid.value = this.props.newcurrent + this.state.bidStep;
			open('alert','bad','Bad Request, Please try agin','fa-exclamation-triangle')
		}
		else {
			this.setState({current: this.bid.value})
			let getCurrent = "https://us-central1-auctkmutt.cloudfunctions.net/getCurrent?itemId="+this.props.item._id
			fetch(getCurrent)
				.then( res => res.json())
				.then( json => this.setState({validates: json}))
		}
	}


	bidPlus = () => {

		let intBid = parseInt(this.bid.value, 10)

		if (this.bid.value < this.props.newcurrent + this.props.bidStep_){
			this.bid.value = this.props.newcurrent
		} else {
			intBid += this.state.bidStep
			this.bid.value = intBid
		}
	}

	bidMinus = () => {

		let intBid = parseInt(this.bid.value, 10)

		if (this.bid.value  <= this.props.newcurrent + this.props.bidStep_){
			this.bid.value = this.props.newcurrent + this.props.bidStep_
		} else {
			intBid -= this.state.bidStep
			this.bid.value = intBid;
		}
	}

	handleBlur = (event) => {
	  if (event.target.value < this.props.newcurrent + this.props.bidStep_){
			event.target.value = this.props.newcurrent + this.props.bidStep_
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.waiting()
		this.isBidForm(this.bid,this.props.open)
	}


    render() {
        return  (
	        	
			<form className="auct-form" onSubmit={this.handleSubmit} autoComplete="off">
				<label>
					<input ref={ bid => this.bid = bid } type="number" onBlur={this.handleBlur} className="auct-form-input" id="NumberInput"/>
					<button className="value value-l" type="button" onClick={this.bidMinus}><i className="fa fa-minus-circle"></i></button>
					<button className="value value-r" type="button" onClick={this.bidPlus}><i className="fa fa-plus-circle"></i></button>
				</label>
				{
					this.props.wait === false ? (
						<button 
							className="button" 
							type="submit" 
							value="Submit"
						 >
						 Bid
						 </button>
					) : (
						<button className="button gray" type="button"><img src={require("../images/Rolling.gif")} alt="Loading"></img></button>
					)
				}
			</form>

        )
    }
}	

export default bidForm
