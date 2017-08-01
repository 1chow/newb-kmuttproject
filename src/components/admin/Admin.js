import React, { Component } from 'react'

import AddCatagory from './AddCatagory'
import AddItem from './AddItem'
import Setting from './Setting'


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
	                            <p className='show-for-large'> Setting</p>
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
									<i className="fa fa-suitcase"></i>
									<p className='show-for-large'> Add Item</p>
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
			            	<AddCatagory />
			            	: this.state.select === 'item' ? <AddItem triggler={this.props.triggler} /> : <Setting triggler={this.props.triggler} profilePicture={this.props.profilePicture} />
		            	}
		            </div>            
		        </div>

	        </div>

        </div>
        )

	}
}
