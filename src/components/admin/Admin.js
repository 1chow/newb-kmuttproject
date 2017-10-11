import React, { Component } from 'react'

import AddCatagory from './AddCatagory'
import AddItem from './AddItem'
import Setting from './Setting'
import RecentChart from './RecentChart'
import ItemsL from './ItemsL'


export default class Admin extends Component {
	state = {
		select : 'setting',
	}

	selected = what => {
		this.setState({select:what})
	}



	render() {

		return (
		<div>
	        <div className="small-2 large-2 admin-l columns">
		        <div className="home-cat setting-cat">
		        	 <ul>
		        	     <li className={(this.state.select === "setting"  && 'active')}>
	                        <button onClick={ () => this.selected("setting")}>
	                            <i className="fa fa-user"></i>
	                            <p className='show-for-large'> Your Profile</p>
	                        </button>
	                    </li>
						<li className={(this.state.select === "recentchart"  && 'active')}>
	                        <button onClick={ () => this.selected("recentchart")}>
	                            <i className="fa fa-history"></i>
	                            <p className='show-for-large'> Recent Auction</p>
	                        </button>
	                    </li>
						{ this.props.role === 'admin' &&
							<li className={(this.state.select === "category"  && 'active')}>
								<button onClick={ () => this.selected("category")}>
									<i className="fa fa-bookmark"> </i>
									<p className='show-for-large'> Add Catagories</p>
								</button>
							</li>
						}
						{ this.props.role === 'admin' &&
							<li className={(this.state.select === "item"  && 'active')}>
								<button onClick={ () => this.selected("item")}>
									<i className="fa fa-sign-in"></i>
									<p className='show-for-large'> Add Item</p>
								</button>
							</li>
						}
						{ this.props.role === 'admin' &&
							<li className={(this.state.select === "sellingitem"  && 'active')}>
								<button onClick={ () => this.selected("sellingitem")}>
									<i className="fa fa-suitcase"></i>
									<p className='show-for-large'> Selling Item</p>
								</button>
							</li>
						}
	                 </ul>
	            </div>
	        </div>
	        <div className="small-10 large-10 admin-r columns">
		        <div className="small-12 columns profile-main">
		            <div className="small-12 columns">
		            	{ this.state.select === 'category' ?
			            		<AddCatagory
									triggler={this.props.triggler}
									items={this.props.items}
								 />
			            	: this.state.select === 'item' ? 
								<AddItem 
									triggler={this.props.triggler}
								/> 
							: this.state.select === 'setting' ?
								<Setting 
									triggler={this.props.triggler} 
									profilePicture={this.props.profilePicture}
								/> 
							: this.state.select === 'recentchart' ?
								<RecentChart
									chartNow={this.props.chartNow}
									items={this.props.items}
									current={this.props.current} 
									convertTimeM={this.props.convertTimeM}
									userUID={this.props.userUID}
								/> 
							:
								<ItemsL
									convertTimeM={this.props.convertTimeM}
									triggler={this.props.triggler}
									items={this.props.items}
								/>
		            	}
		            </div>            
		        </div>
	        </div>
        </div>
        )

	}
}
