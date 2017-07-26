import React, { Component } from 'react'


export default class Admin extends Component {

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

	      <div className="small-12 columns profile-main">
            <div className="small-12 columns">
              <h1>Catagories</h1>
              <p>for Product</p>
              <div className="hr-text-center"><hr/></div>
            </div>
          </div>

        )

	}
}
