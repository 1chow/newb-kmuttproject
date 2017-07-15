import React, { Component } from 'react'
import { Link , withRouter } from "react-router-dom";

class Categories extends Component {
    shouldComponentUpdate(nextProps, nextState) {
		if (this.props.location.pathname === nextProps.location.pathname) {
				return false
			} else { return true }
	}
    render() {
    return this.props.location.pathname === '/item/1' ? 
      (
      <div className="row">
            <div className="home-cat">
                <ul>
                    <li className="active">
                        <Link to="/">
                            <i className="fa fa-clock-o"></i>
                            <p className="show-for-medium">Last Ending</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-home"></i>
                            <p className="show-for-large">House Hold</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-plug"></i>
                            <p className="show-for-large">Electric	Gadget</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-diamond"></i>
                            <p className="show-for-large">Jewery & Beautyware</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-bicycle"></i>
                            <p className="show-for-large">Activity Product</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-cutlery"></i>
                            <p className="show-for-large">Food & Beverage</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
    : this.props.location.pathname === '/' ? (
      <div className="row">
            <div className="home-cat">
                <ul>
                    <li className="active">
                        <Link to="/">
                            <i className="fa fa-clock-o"></i>
                            <p className="show-for-medium">Last Ending</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-home"></i>
                            <p className="show-for-large">House Hold</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-plug"></i>
                            <p className="show-for-large">Electric	Gadget</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-diamond"></i>
                            <p className="show-for-large">Jewery & Beautyware</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-bicycle"></i>
                            <p className="show-for-large">Activity Product</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-cutlery"></i>
                            <p className="show-for-large">Food & Beverage</p>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
    : null
  }
}

export default withRouter(Categories)

