import React, { Component } from "react";

export default class ProjectItem extends Component {
	render() {
		return (
			<section className="warpper">
				<div className="row auct-content">
					<div className="small-9 columns">
						<h1>Lorem ipsum dolor sit amet</h1>
						<p className="show-for-medium">Consectetur adipisicing elit. Est sed.</p>
					</div>
					<div className="small-3 columns">
						<p className="price">999<span className="curentcy">Bath</span></p>
					</div>
				</div>
				<div className="row ">
					<div className="small-12 medium-5 large-7 columns auct-l-container">
						<div className="item-warper">
							<div className="item">
								<img src="http://dummyimage.com/670x580/292929/e3e3e3&text=Your Mom Goes to College" alt=""></img>
							</div>
						</div>
				</div>
					<div className="small-12 medium-7 large-5 columns auct-r-container">
						<div className="auct-content">
							<div className="row auct-from-warp">
								<div className="small-5 medium-5 columns">
									<p className="time">Time Remaining<br></br><span className="timecount green">00:00:10</span></p>
								</div>
								<div className="small-7 medium-7 columns auct-from-bit">
									<p className="time">Place Your Bid</p>
									<form className="auct-form" data-abide noValidate>
										<label>
											<div className="input-group">
												<span className="input-group-label">฿</span>
												<input className="input-group-field auct-form-input" id="NumberInput" type="number" required pattern="number"/>
											</div>
										</label>
										<button className="button" type="submit" value="Submit">Bid</button>
									</form>
									<p className="helper">Bids More Than 999฿ To Win This Auction</p>
								</div>
							</div>
							<div className="row auct-from-warp">
								<div className="small-12 medium-12 columns">
									<p className="time">Bidding List</p>
									<table className="hover unstriped">
										<tbody>
											<tr>
												<td>Oatteeraphat</td>
												<td>999 <span>THB</span></td>
												<td>00:00:00</td>
											</tr>
											<tr>
												<td>Oatteeraphat</td>
												<td>999 <span>THB</span></td>
												<td>00:00:00</td>
											</tr>
											<tr>
												<td>Oatteeraphat</td>
												<td>999 <span>THB</span></td>
												<td>00:00:00</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div className="row auct-from-markdown">
								<div className="small-12 medium-12 columns">
									<h3>Lorem ipsum dolor sit amet</h3>
									<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique accusantium magni cupiditate dolorem, iusto aspernatur odio ipsa cumque sed ullam voluptatibus quas velit! Voluptatibus quod ea reiciendis maiores, at deleniti.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
