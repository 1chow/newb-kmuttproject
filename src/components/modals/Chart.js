import React , { Component }  from 'react'

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

						<ModalChartWin timeDiff={this.props.timeDiff} orderLists={this.props.orderLists} close={this.props.close} filter={this.props.filter} />
					
					</div>
				</div>				
	    )
	}
}
