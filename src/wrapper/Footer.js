import React, { Component } from 'react'


export default class Footer extends Component {
  render() {
    return  (
        <footer>
			<div className="row">
				<div className="small-12 medium-4 columns footer-l">
					<h1><i className="fa fa-gavel fa-1x"></i> AUCT.js</h1>
				</div>
				<div className="small-12 medium-8 columns footer-r">
					<p>Asynchronous Content Management System for Auction,KMUTT</p>
				</div>
			</div>
		</footer>
    );
  }
}