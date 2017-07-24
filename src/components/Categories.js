import React, { Component } from 'react'
import { Link , withRouter } from "react-router-dom";

class Categories extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.location.pathname === nextProps.location.pathname) {
            if (this.props.isActive === nextProps.isActive) {
                return false
            } else { return true }
        } else { return true }
	}
    render() {
    return (
        <div className="row">
                <div className="home-cat">
                { (this.props.location.pathname === '/checkout-info' || this.props.location.pathname === '/checkout' ) ?
                    <ul>
                        <li className={(this.props.isActive === "YD"  && 'active')}>
                            <Link to="/checkout-info" onClick={ () => this.props.filter("YD")}>
                                <i className="fa fa-vcard-o"></i>
                                <p className={(this.props.isActive === "YD"  ? 'show-for-medium' : 'show-for-large')}>Your Detail</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "CS"  && 'active')}>
                            <Link to="/checkout" onClick={() => this.props.filter("CS")}>
                                <i className="fa fa-check"></i>
                                <p className={(this.props.isActive === "CS"  ? 'show-for-medium' : 'show-for-large')}>Checkout Sucess</p>
                            </Link>
                        </li>
                    </ul>  :
                    <ul>
                        <li className={(this.props.isActive === "LE"  && 'active')}>
                            <Link to="/" onClick={ () => this.props.filter("LE")}>
                                <i className="fa fa-clock-o"></i>
                                <p className={(this.props.isActive === "LE"  ? 'show-for-medium' : 'show-for-large')}>Last Ending</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "HH"  && 'active')}>
                            <Link to="/" onClick={() => this.props.filter("HH")}>
                                <i className="fa fa-home"></i>
                                <p className={(this.props.isActive === "HH"  ? 'show-for-medium' : 'show-for-large')}>House Hold</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "EG"  && 'active')}>
                            <Link to="/" onClick={() => this.props.filter("EG")}>
                                <i className="fa fa-plug"></i>
                                <p className={(this.props.isActive === "EG"  ? 'show-for-medium' : 'show-for-large')}>Electric	Gadget</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "JB"  && 'active')}>
                            <Link to="/" onClick={() => this.props.filter("JB")}>
                                <i className="fa fa-diamond"></i>
                                <p className={(this.props.isActive === "JB"  ? 'show-for-medium' : 'show-for-large')}>Jewery & Beautyware</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "AP"  && 'active')}>
                            <Link to="/" onClick={() => this.props.filter("AP")}>
                                <i className="fa fa-bicycle"></i>
                                <p className={(this.props.isActive === "AP"  ? 'show-for-medium' : 'show-for-large')}>Activity Product</p>
                            </Link>
                        </li>
                        <li className={(this.props.isActive === "FB"  && 'active')}>
                            <Link to="/" onClick={() => this.props.filter("FB")}>
                                <i className="fa fa-cutlery"></i>
                                <p className={(this.props.isActive === "FB"  ? 'show-for-medium' : 'show-for-large')}>Food & Beverage</p>
                            </Link>
                        </li>
                    </ul>
                }
                </div>
            </div>
         )
    }
}

export default withRouter(Categories)

