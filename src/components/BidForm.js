import React, { Component } from 'react'
import { firebaseAuth } from '../helpers/firebase'

class bidForm extends Component {

	state = {
		validates:[],
		current: ''
	}

	componentDidUpdate(prevProps, prevState) {
		this.state.validates !== prevState.validates &&
		this.Validation(this.props.item,this.props.params,this.state.current,this.props.open,this.state.validates.endTime,this.state.validates.isActive,this.props.newcurrent)
	}

    Validation = (oldItem,itemId,current,open,endTime,life,validatecurrent) => {
		var user = firebaseAuth().currentUser
		if (user) {
			let email = user.email
			let postBid = "https://us-central1-auctkmutt.cloudfunctions.net/bidOrder?itemId="+itemId+"&bid="+current+"&uId="+email

			var myInit =  { method: 'GET',
                mode: 'no-cors',
                headers: new Headers(
                   {"Content-Type": "*"}
                ),
             }
			if (life === 1){ //fininsh gate1 : Item expired
				if (oldItem._id === itemId){ //fininsh gate2 : Item is Equal
					if(validatecurrent < current){ //fininsh gate3 : Check Over Old Cost?
							fetch(postBid, myInit)
								.then( res => res && open('good','Congrat! You win in this round'))
								.catch( err => err && open('bad','Unfortunately Bad Request'))
					} else open('bad','Make sure you bid enough')
				} else open('bad','Its a bad path pls refresh')
			} else open('bad','Item expired')
		} else open('bad','Please LogIn')
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.setState({current: this.bid.value})
		let getCurrent = "https://us-central1-auctkmutt.cloudfunctions.net/getCurrent?itemId="+this.props.item._id
		fetch(getCurrent)
			.then( res => res.json())
			.then( json => this.setState({validates: json}))
	}


    render() {
        return (
			<form className="auct-form" onSubmit={this.handleSubmit}>
				<label>
					<div className="input-group">
						<span className="input-group-label">฿</span>
						<input ref={ bid => this.bid = bid} className="input-group-field auct-form-input" id="NumberInput" type="number" required pattern="number"/>
					</div>
				</label>
				<button className="button" type="submit" value="Submit">Bid</button>
			</form>
        )
    }
}

export default bidForm
