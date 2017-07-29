import React, { Component } from 'react'
import { Link , withRouter } from "react-router-dom";


import AddCatagory from './AddCatagory'
import AddItem from './AddItem'


export default class Admin extends Component {


	render() {

		return (
		<div>

	        <div className="small-2 large-2 admin-l columns">
		        <div className="home-cat setting-cat">
		        	 <ul>
	                    <li className="active">
	                        <button onClick={ () => this.props.filter("YD")}>
	                            <i className="fa fa-bookmark"> </i>
	                            <p className={(this.props.isActive === "YD"  ? 'show-for-medium' : 'show-for-large')}> Add Catagories</p>
	                        </button>
	                    </li>
	                    <li className={(this.props.isActive === "YD"  && 'active')}>
	                        <button onClick={ () => this.props.filter("YD")}>
	                            <i className="fa fa-suitcase"></i>
	                            <p className={(this.props.isActive === "YD"  ? 'show-for-medium' : 'show-for-large')}> Add Item</p>
	                        </button>
	                    </li>
	                 </ul>
	            </div>
	        </div>

	        <div className="small-10 large-10 admin-r columns">
	        	
		        <div className="small-12 columns profile-main">
		            <div className="small-12 columns">
		            	{/*<AddCatagory/>*/}
		            	<AddItem/>
		            </div>            
		        </div>

	        </div>

        </div>
        )

	}
}
