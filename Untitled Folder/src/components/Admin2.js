import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Admin extends Component {
	componentDidMount(){

	}
	render() {
		return (
		<div>
	        <div className="small-2 large-2 admin-l columns">
		        <div className="home-cat setting-cat">
		        	 <ul>
	                    <li className={(this.props.isActive === "admin1"  && 'active')}>
	                        <Link to="/admin1" onClick={ () => this.props.filter("admin1")}>
	                            <i className="fa fa-vcard-o"></i>
	                            <p className={(this.props.isActive === "admin1"  ? 'show-for-medium' : 'show-for-large')}>admin1</p>
	                        </Link>
	                    </li>
	                    <li className={(this.props.isActive === "admin2"  && 'active')}>
	                        <Link to="/admin2" onClick={ () => this.props.filter("admin2")}>
	                            <i className="fa fa-vcard-o"></i>
	                            <p className={(this.props.isActive === "admin2"  ? 'show-for-medium' : 'show-for-large')}>admin2</p>
	                        </Link>
	                    </li>
	                    <li  className={(this.props.isActive === "admin3"  && 'active')}>
	                        <Link to="/admin3" onClick={ () => this.props.filter("admin3")}>
	                            <i className="fa fa-vcard-o"></i>
	                            <p className={(this.props.isActive === "admin3"  ? 'show-for-medium' : 'show-for-large')}>admin3</p>
	                        </Link>
	                    </li>
						<li className={(this.props.isActive === "admin4"  && 'active')}>
	                        <Link to="/admin4" onClick={ () => this.props.filter("admin4")}>
	                            <i className="fa fa-vcard-o"></i>
	                            <p className={(this.props.isActive === "admin4"  ? 'show-for-medium' : 'show-for-large')}>admin4</p>
	                        </Link>
	                    </li>
	                 </ul>
	            </div>
	        </div>
			<div className="small-12 large-6 columns">
          <div className="small-12 columns profile-main">
            <div className="small-12 columns">
              <h1>ADD Product</h1>
              <p>to Catagories</p>
              <div className="hr-text-center"><hr/></div>
            </div>
            <form>
                <div className="small-12 columns">
                  <label>Product Name
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
                <div className="small-12 columns">
                  <label>Product Description
                    <textarea  type="text" placeholder="Product Description Here" aria-describedby="help-signup" id="" rows="5" required pattern="text"
					name="desc" ></textarea>
                    <span className="form-error">Yo, Product Description required!!</span>
                  </label>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>First Bit
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" id="exampleNumberInput" type="number" required pattern="number" />
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Reserve time
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" id="exampleNumberInput" type="number" required pattern="number"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 columns">
                  <label>Time in Second
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
                <div className="small-12 columns admin-from-btm">
                  <button className="button success" type="submit" value="Submit">ADD AUCTION</button>
                </div>
            </form>
          </div>
        </div>
        </div>
        )

	}
}
