import React , { Component }  from 'react'
import ModalChartWin from "./modalChartWin"
import ChartNow from "./chartNow"

export default class Chart extends Component {
	state = {
			cartType : 'nowAuction',
		}
		
	render() {
	    return (
	            <div className="modal-core modal-fw modal-chart">
					<div className="row modal-core-head">
						<h3><i className="fa fa-shopping-basket"></i> Cart</h3>
						<button onClick={this.props.close} className="close"><i className="fa fa-times"></i></button>
					</div>
					<div className="row">
						<div className="home-cat">
							<ul>
								<li className={(this.state.cartType === 'nowAuction'  && 'active')}>
									<button onClick={() => this.setState({cartType:'nowAuction'})}>
										<i className="fa fa-gavel"></i>
										<p className={(this.state.cartType === 'nowAuction'  ? 'show-for-medium' : 'show-for-large')}>Now Auction</p>
									</button>
								</li>
								<li className={(this.state.cartType !== 'nowAuction'  && 'active')}>
									<button onClick={() => this.setState({cartType:'winAuction'})}>
										<i className="fa fa-trophy"></i>
										<p className={(this.state.cartType !== 'nowAuction'  ? 'show-for-medium' : 'show-for-large')}>Win Orders</p>
									</button>
								</li>
							</ul>
						</div>
					</div>
					<div className="row">
						{this.state.cartType === 'nowAuction' ?
							<ChartNow
								items={this.props.items}
								timeNows={this.props.timeNows}
								current={this.props.current} 
								close={this.props.close}
								secondsToHms={this.props.secondsToHms} 
							/>
							:
							<ModalChartWin 
								orderLists={this.props.orderLists} 
								close={this.props.close} 
								filter={this.props.filter}
							/>
						}
					</div>
				</div>				
	    )
	}
}
