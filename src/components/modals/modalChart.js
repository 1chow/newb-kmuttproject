import React , { Component }  from 'react'
import { Link } from "react-router-dom"

import SellingArea from "../SellingArea"
import ModalChartWin from "./modalChartWin"

export default class ModalChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cartType : 'nowAuction',
		}
	}

	componentDidMount() {
	}

	handlenowAuction = () => {
    	this.setState({ cartType : 'nowAuction' });
	}
	handlewinOrder = () => {
    	this.setState({ cartType : 'winOrder' });
	}


	render() {
	    return (
	            <div className="modal-core modal-fw modal-chart">
					<div className="row modal-core-head">
						<h3><i className="fa fa-shopping-basket"></i> Cart</h3>
						<button onClick={this.props.close} className="close"><i className="fa fa-times"></i></button>
					</div>
					
					<div className="row">

						{/*catagories*/}
							<div className="home-cat">
								<ul>
									<li className={(this.state.cartType === "nowAuction"  && 'active')}>
									<button onClick={this.handlenowAuction}>
										<i className="fa fa-gavel"></i>
										<p className="">Now Auction</p>
									</button>
									</li>
									<li className={(this.state.cartType === "winOrder"  && 'active')}>
									<button onClick={this.handlewinOrder}>
										<i className="fa fa-trophy"></i>
										<p className="">Win Orders</p>
									</button>
									</li>
								</ul>
							</div>

						    {(() => {
						        switch (this.state.cartType) {
						        	case 'nowAuction':
						                return <SellingArea projects={this.props.projects} />
						            case 'winOrder':
						                return <ModalChartWin projects={this.props.projects} />
						            default :
						                return 'You Not Have The Cart'
						        }
						    })()}
					</div>
				</div>				
	    )
	}
}
