import React, { Component } from 'react'

class Checkout extends Component {
	componentDidMount() {
		this.props.filter("CS")
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
						<p>Thankyou,You Can Enjoy More At AUCT</p>
						<button className="button"><i className="fa fa-shopping-cart"></i>  Let's Auction</button>
						<button className="button"><i className="fa fa-print"></i>  Print Recive</button>
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
								<p className="address"><span className="name">Lorem ipsum dolor sit amet</span>Consectetur adipisicing elit. Illo maiores porro blanditiis dolorum expedita impedit veniam tempora ea obcaecati explicabo iure fuga autem reprehenderit eius quasi, ipsum delectus adipisci laudantium&#13;&#10;00-000-0000</p>
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
								<tr>
									<td>Oatteeraphat</td>
									<td className="text-center">1</td>
									<td className="text-right">999.00 <span>THB</span></td>
								</tr>
								<tr>
									<td>Oatteeraphat</td>
									<td className="text-center">1</td>
									<td className="text-right">999.00 <span>THB</span></td>
								</tr>
								<tr>
									<td>Oatteeraphat</td>
									<td className="text-center">1</td>
									<td className="text-right">999.00 <span>THB</span></td>
								</tr>
								<tr>
									<td>Oatteeraphat</td>
									<td className="text-center">1</td>
									<td className="text-right">999.00 <span>THB</span></td>
								</tr>
								<tr></tr>
								<tr>
									<th className="text-right">Total</th>
									<th className="text-center">3</th>
									<th className="text-right">2,997 <span>THB</span></th>
								</tr>
								</tbody>
							</table>
						</div>


					<hr/>
						<div className="checkout-box">
							<div className="small-12 medium-6 columns">
								<p className="address"><span className="name"><i className="fa fa-gavel fa-1x"></i> Auct Call Center</span>Telphone : 1150 (9:00-16:00 GMT+7) <br></br>Email : Auct@Auct.Auct</p>
							</div>
							<div className="small-12 medium-6 columns ">
								<p className="address"><span className="name">Payment On Delevery</span>Amount : 1,038.00 THB<br></br>Transaction Id: 1234489875445</p>
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

export default Checkout
