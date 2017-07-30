import React, { Component } from 'react'
import { Link , withRouter } from "react-router-dom";
import Loading from './Loading'

class Categories extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.categories === nextProps.categories) {
            if (this.props.location.pathname === nextProps.location.pathname) {
                if (this.props.isActive === nextProps.isActive) {
                    return false
                } else { return true }
            } else { return true }
        } else { return true }
	}
    render() {
    return this.props.categories ? (
        (this.props.location.pathname === '/admin' || this.props.location.pathname === '/checkout' || this.props.location.pathname === '/admin3' || this.props.location.pathname === '/admin4' ) ? null : (
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
                        <li className={(this.props.isActive === "default"  && 'active')}>
                            <Link to="/" onClick={ () => this.props.filter("default")}>
                                <i className="fa fa-clock-o"></i>
                                <p className={(this.props.isActive === "default"  ? 'show-for-medium' : 'show-for-large')}>Last Ending</p>
                            </Link>
                        </li>
                        {this.props.categories.map( category => {
                            return ( 
                            <li key={category._id} className={(this.props.isActive === category.name  && 'active')} >
                                <Link to='/' onClick={() => this.props.filter(category.name)} >
                                    <i className={"fa " + category.icon}></i>
                                    <p className={(this.props.isActive === category.name  ? 'show-for-medium' : 'show-for-large')}>{category.name}</p>
                                </Link>
                            </li>
                            );
                        })}
                    </ul>
                }
                </div>
            </div>)
         ) : <Loading />
    } 
}

export default withRouter(Categories)

