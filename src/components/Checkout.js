import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase'



class CheckoutList extends Component {
  render(){
    return (
	    <tr>
			<td>{this.props.itemName}</td>
			<td className="text-center">1</td>
			<td className="text-right">{this.props.itemPrice}.00 <span>THB</span></td>
		</tr>      
    );
  }
}

export default class Checkout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			orderL: [],
			orderDesc: [],
			user_ : []
		};
	}
	componentDidMount() {
		firebase.database().ref('/users/'+ this.props.userUID + '/info' ).once('value', dataSnapshot => {
				let orderPrice = dataSnapshot.val();
			this.setState({
	        	user_: orderPrice
	      		});
		})
	}

	componentWillReceiveProps(nextProps,nextState) {
		if (this.props.userUID) {
			firebase.database().ref('orders/'+ this.props.userUID +'/orderList').once('value', dataSnapshot => {
				var list = [];
				dataSnapshot.forEach(childSnapshot => {
					let orderPrice = childSnapshot.val();
					list.push(orderPrice)
					})
					this.setState({
					orderL: list
					});
			})
			firebase.database().ref('/orders/'+ this.props.userUID).once('value', dataSnapshot => {
				var list = [];
				dataSnapshot.forEach(childSnapshot => {
					let orderPrice = childSnapshot.val();
					list.push(orderPrice)
				})
				this.setState({
					orderDesc: list
					});
			})
		}
	}

	print(){
	    window.print();
	}

	componentWillUnmount() {
		firebase.database().ref('/users/'+ this.props.userUID + '/info' ).off()
		firebase.database().ref('orders/'+ this.props.userUID +'/orderList').off()
		firebase.database().ref('/orders/'+ this.props.userUID).off()
	}

    render() {
        return (
        <div className="row ">
		<div className="small-12 medium-12 columns auct-l-container">
			<div className="auct-content checkout-content">
				<div className="post-feed post-feed-checkout checkout-summary">
					<div className="small-12 columns post-checkout check-sucess print-none text-center">
						<i className="fa fa-check-circle fa-5x" aria-hidden="true"></i>
						<h3>Checkout Sucessful</h3>
						<p>Thankyou,You Can Enjoy More At AUCT</p><br/>
						<Link onClick={() => this.props.filter('default')} to="/" className="button"><i className="fa fa-shopping-cart"></i>  Let's Auction</Link>
						<Link to="#" onClick={this.print} className="button"><i className="fa fa-print"></i>  Print Recive</Link>
					</div>
				</div>
				<div className="post-feed post-feed-checkout checkout-summary show-for-medium">
					<div className="small-12 columns post-checkout print-warpper">
							<div className="checkout-box row">
								<div className="small-12 medium-6 columns hide-for-small nav-print">
										<h1><i className="fa fa-gavel fa-1x"></i> AUCT</h1>
								</div>
								<div className="small-12 medium-6 columns hide-for-small text-right">
										<h3 className="print">Payment Conferm</h3><br></br>
										<p className="address">Id: 1234489875445 <br></br>Date : 00/00/0000</p>
								</div>
							</div>
							<div className="checkout-box">
								<div className="small-12 medium-6 columns">
									<p className="address"><span className="name">{}</span>Consectetur adipisicing elit. Illo maiores porro blanditiis dolorum expedita impedit veniam tempora ea obcaecati explicabo iure fuga autem reprehenderit eius quasi, ipsum delectus adipisci laudantium</p>
								</div>
							</div>
						<hr/>

							<div className="small-12 medium-12 columns">
								<br></br>
								<table className="hover unstriped table-scroll print-table">
									<tbody>
									<tr className="print-only">
										<th className="text-left">ITEM</th>
										<th width="75" className="text-center">AMOUNT</th>
										<th width="175">PRICE</th>
									</tr>
									{this.state.orderL.map((orderL) => {
	                  					return ( 
	                  						<CheckoutList key={orderL.itemId} {...orderL} />
									);})}
									{this.state.orderL.length !== 0 ?
										<tr>
											<td>Delivery Charge</td>
											<td className="text-center">-</td>
											<td className="text-right">39.00 <span>THB</span></td>
										</tr>
										:
										<tr>
											<td>Delivery Charge</td>
											<td className="text-center">-</td>
											<td className="text-right">-</td>
										</tr>
									}
									{this.state.orderDesc[1] &&
										<tr>
											<th className="text-right">Total</th>
											<th className="text-center">{Object.keys(this.state.orderDesc[1]).length}</th>
											<th className="text-right">{this.state.orderDesc[2] + 39}.00 <span>THB</span></th>
										</tr>
									}
									</tbody>
								</table>
							</div>


						<hr/>
							<div className="checkout-box">
								<div className="small-12 medium-6 columns">
									<p className="address"><span className="name"><i className="fa fa-gavel fa-1x"></i> Auct Call Center</span>Telphone : 1150 (9:00-16:00 GMT+7) <br></br>Email : Auct@Auct.Auct</p>
								</div>
								<div className="small-12 medium-6 columns ">
									<p className="address"><span className="name">Payment On Delevery</span>Amount : {this.state.orderDesc[2] && this.state.orderDesc[2] + 39} THB<br></br>Transaction Id: 1234489875445</p>
								</div>
								<div className="small-12 medium-6 columns none">
									<p className="address"><span className="name">Payment By Omise</span>Card Info. : Undified <br></br>Amount : Undified <br></br>Transaction Id: 1234489875445</p>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
	</div>
        )
    }
}

