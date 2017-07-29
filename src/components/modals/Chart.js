import React , { Component }  from 'react'

import Sellingareas from "../Sellingareas"
import ModalChartWin from "./modalChartWin"
import * as Animated from "animated/lib/targets/react-dom";

export default class Chart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cartType : 'nowAuction',
		}
	}

	componentDidMount() {
		this._sortModalItems(this.props.items);
	}
	
	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.items.length && nextProps.items.length) {
			this._sortModalItems(nextProps.items);
		}
	}

	handlenowAuction = () => {
    	this.setState({ cartType : 'nowAuction' });
	}
	handlewinOrder = () => {
    	this.setState({ cartType : 'winOrder' });
	}

	_sortModalItems = ( items ) => {
		if (this.state.cartType === 'nowAuction')
		var newitems = items.filter( (item,n) => {
			return item.catagory === this.props.isActive
		})
		else newitems = items
		this.setState(
			{
				items: newitems,
				animations: newitems.map((_, i) => new Animated.Value(0))
			}
		)
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
						                return <Sellingareas current={this.props.current} isActive={this.props.isActive} items={this.props.items} close={this.props.close} />
						            case 'winOrder':
						                return <ModalChartWin timeDiff={this.props.timeDiff} orderLists={this.props.orderLists} close={this.props.close} filter={this.props.filter} />
						            default :
						                return 'You Not Have The Cart'
						        }
						    })()}
					</div>
				</div>				
	    )
	}
}
