import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Projects extends Component {
	render() {
		return (
			<div className="row">
				<div className="page-404-container">
					<div className="page-404">
						<h3>404</h3>
						<p className="quote">This Page Not Found.</p>
						<Link to="/" onClick={this.props.getObjects} className="button success">Just Auction</Link>
					</div>
				</div>
			</div>

		);
	}
}
