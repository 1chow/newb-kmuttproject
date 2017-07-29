import React, { Component } from 'react'

class Checkoutinfo extends Component {
	componentDidMount() {
		this.props.filter("YD")
	}
    render() {
        return (
<div className="row">
    <div className="small-12 medium-12 large-7 columns auct-l-container">
        <div className="auct-content checkout-content">
            <div className="post-feed post-feed-checkout checkout-summary">
				<form>
					<div className="small-12 columns post-checkout">
						<h3>Shipping Information</h3>
							<div className="checkout-box">
								<div className="small-12 columns">
									<p className="desc">
										<i className="fa fa-home"></i> 
										Your Adderess
										<span>
										<a href=""><i className="fa fa-pencil-square-o edit"></i> Edit</a>
										</span>
									</p>
									<textarea className="checkout-address" name="" id="" rows="5" defaultValue={this.props.Lorem} readOnly></textarea>
								</div>
							</div>
						<hr/>
							<div className="checkout-box">
								<div className="small-12 columns">
									<p className="desc">
										<i className="fa fa-paper-plane"></i> 
										Shipping Method
									</p>
									<div className="checkout-payment-box">
										<div className="row">
											<div className="small-4 columns active">
												<img src={require("../images/Shipping1.jpg")} alt=""></img>
												<p className="text-center">Economy Free</p>
											</div>
											<div className="small-4 columns">
												<img src={require("../images/Shipping2.jpg")} alt=""></img>
												<p className="text-center">Standard 39฿</p>
											</div>
											<div className="small-4 columns">
												<img src={require("../images/Shipping3.jpg")} alt=""></img>
												<p className="text-center">Express 69฿</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-container" style={{display: 'none'}}>
								<div className="modal-core modal-mid modal-login modal-address">
									<div className="row modal-core-head">
										<h3 className="bold"><i className="fa fa-gavel"></i> AUCT</h3>
										<button className="close"><i className="fa fa-times"></i></button>
									</div>
									<div className="row">
								    	<div className="small-12 medium-11 small-centered">
								    	 	<div className="small-12 columns relative text-center">
								    	 		<hr className="hr-head"></hr>
								    	 		<h3 className="head text-center">Your Address</h3>
								    	 	</div>
											<div className="small-12 columns">
											  	<div className="alert callout" style={{display: 'none'}}>
											    	<p><i className="fi-alert"></i> There are some errors in your form.</p>
											  	</div>
											</div>
									        <div className="small-12 columns">
										        <label>
											        <input type="text" placeholder="Your User Name"></input>
										      	</label>
										      	<label>
											        <input type="text" placeholder="E-mail Address"></input>
										      	</label>
										        <label>
											        <textarea className="checkout-address" name="" id="" rows="5" autoCorrect="off" defaultValue={this.props.Lorem} spellCheck="false" ></textarea>
											    </label>
											    <label>
											        <input type="password" id="password" placeholder="Postcode"></input>
											    </label>
											    <label>
											        <input type="password" id="password" placeholder="Phone Number"></input>
											    </label>
									        </div>
									        <div className="small-12 columns">
								        		<button className="button success">Edit Now</button>
									        </div>
										</div>
									</div>
								</div>
							</div>
					</div>
					<div className="small-12 columns post-checkout">
						<h3>Payment Information</h3>
							<div className="checkout-box">
								<div className="small-12 columns">
									<p className="desc">
										<i className="fa fa-address-card"></i> 
										Payment Method
									</p>
									<div className="checkout-payment-box">
										<div className="row">
											<div className="small-6 columns active">
												<img src={require("../images/payment1.jpg")} alt=""></img>
												<p className="text-center">Credit Card By Omise</p>
											</div>
											<div className="small-6 columns">
												<img src={require("../images/payment2.jpg")} alt=""></img>
												<p className="text-center">Cash On Delivery</p>
											</div>
										</div>
									</div>
									<hr/>
									<div className="checkout-payment-tab">
										<div className="row">
											<div className="small-8 medium-6 small-centered text-center">
											<p>Secure & No More Charge</p>
											<button className="button omise" id="omiseTrigger"><i className="fa fa-lock"></i>  Pay Now</button>
											<img src={require("../images/omise.JPG")} alt=""></img>
											</div>
										</div>
										<div className="row none">
											<div className="small-8 medium-6 small-centered text-center">
											<p>Service Charge 20 ฿</p>
											<button className="button"><i className="fa fa-shopping-cart"></i>  Checkout Now</button>
											<p>Charge added by service provider.</p>
											</div>
										</div>
							      	</div>
								</div>
							</div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
		<div className="small-12 medium-12 large-5 columns auct-r-container">
			<div className="auct-content checkout-content">
				<div className="post-feed post-feed-checkout checkout-summary">
					<div className="small-12 columns post-checkout">
						<h3>Order Summary</h3>
						<p className="desc">Payment Pending</p><br></br>
						<ul>
							<li>Item 1<span>999 THB</span></li>
							<li>Item 2<span>999 THB</span></li>
							<li>Item 3<span>999 THB</span></li>
							<li>Delivery Charge<span>39 THB</span></li>
						</ul>
						<hr/>
						<ul>
							<li className="price">Total<span>9,999 THB</span><p>(VAT incl.)</p></li>
						</ul>
					</div>
					<div className="small-12 columns post-checkout" style={{background: '#fff'}}>
						<div className="desc-box">
							<p><i className="fa fa-truck fa-2x"> </i> Get Your Order, 1-2 Days Delivery</p>
						</div>
					</div>
            </div>
        </div>
    </div>
</div>
        )
    }
}

Checkoutinfo.defaultProps = {Lorem:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo maiores porro blanditiis dolorum expedita impedit veniam tempora ea obcaecati explicabo iure fuga autem reprehenderit eius quasi, ipsum delectus adipisci laudantium 00-000-0000'}

export default Checkoutinfo
