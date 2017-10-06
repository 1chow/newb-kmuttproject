import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class RecentChart extends Component {
    state = {
        items: [],
        animations: [],
        newcurrent:[],
    }

    componentDidMount() {
		this.setState({chartNow: this.props.chartNow},() => {
			if(this.state.chartNow){
				this._renderProjects(this.props.items)
				this._filtercurrent(this.props.current)
			}
		})
	}
    
    componentWillReceiveProps(nextProps) {
		if(nextProps.items) {
			if(this.state.items.length !== nextProps.items.filter( item => item.isActive === 0).length){
				this._renderDelete(nextProps.items)
				this._filtercurrent(nextProps.current)
			}
		}
		if (this.props.items.length !== nextProps.items.length && this.state.chartNow) {
			this._renderProjects(nextProps.items);
		}
		if (nextProps.current.length !== 0 && this.state.chartNow) {
			this._filtercurrent(nextProps.current)
		}
	}

	_renderDelete(items) {
		let {chartNow} = this.state
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive === 0
		})
		let newitems = filterItems.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
		this.setState({
			items: newitems
		})
	}


    _renderProjects(items) {
		let {chartNow} = this.state
		let sortItems = items.sort(function(a, b){
			return a.bid.endTime-b.bid.endTime
		})
		let filterItems = sortItems.filter( item => {
			return item.isActive === 0
		})
		let newitems = filterItems.filter( a => {
			return chartNow.indexOf(a._id) !== -1
		})
		this.setState(
			{
				items: newitems
			}
		)
	}

	
	_filtercurrent = (currents) => {
		let {chartNow} = this.state
		let sortCurrents = currents.sort(function(a, b){
			return a.endTime-b.endTime
		})
		let filterCurrents = sortCurrents.filter( current => {
			return current.isActive === 0
		})
		let newcurrents = filterCurrents.filter( a => {
			return chartNow.indexOf(a.itemId) !== -1
		})
        newcurrents.length !== null && this.setState({newcurrent: newcurrents})
    }
    
    render() {
		let {chartNow} = this.props
        return (this.state.chartNow && this.state.items.length !== 0 ) ? (
			<div className="row">
			    <div className="small-12 columns">
		              <h1>Recent Auction</h1>
		              <p>Your auction history</p>
		              <div className="hr-text-center"><hr/></div>
	            </div>
				<div className="row auct-from-warp admin-table">
					<table className="hover">
						<tbody>
						<tr>
							<td width="40"></td>
							<td width="210">ID</td>
							<td className="show-for-large" width="210">Name</td>
							<td className="show-for-large" width="150">Categories</td>
							<td className="show-for-large" width="150">Start</td>
							<td className="show-for-large" width="150">End</td>
						</tr>
						{this.state.items.map((item,i) => {
							return (
							<tr key={i}>
								<td><i className={"fa fa-check-circle-o fa-2x" }></i></td>
								<td>{item.key}</td>
								<td className="show-for-large">{item.name}</td>
								<td className="show-for-large">{item.catagory}</td>
								<td className="show-for-large">{this.props.convertTimeM(item.bid.startTime)}</td>
								<td className="show-for-large">{this.props.convertTimeM(item.bid.endTime)}</td>
							</tr>
							)})
						}
						</tbody>
					</table>
					</div>
			</div>
        ) : this.props.items.filter( item => item.isActive === 0 && chartNow.indexOf(item._id) !== -1).length === 0 ?
		<div className="row">
			<div className="small-12 columns">
	              <h1>Recent Auction</h1>
	              <p>Your auction history</p>
	              <div className="hr-text-center"><hr/></div>
            </div>
			<div className="page-404-chart page-404-container fade-animate">
				<div className="page-404">
					<p className="quote">Your auction history was empty list !!</p>
					<Link to="/" onClick={this.props.close} className="button success">Just Auction</Link>
				</div>
			</div>
		</div> : null
    }
}

export default RecentChart
