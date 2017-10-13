import React, { Component } from 'react'
import * as Animated from "animated/lib/targets/react-dom";
import { Link } from 'react-router-dom'
import Clock from './Clock'

class Sellingarea extends Component {

    render() {
        let {handleClose, style, item, timeNows, current, secondsToHms ,priceFormat} = this.props
        return (
            <div className="small-6 medium-4 large-3 columns post-box">
                <Animated.div style={style}>
                    <Link onClick={handleClose} to={'/item/'+ item._id} >
                        <div className="post-box-top">
                            <img src={item.img} alt=""/>
                        </div>
                        <div className="post-box-content">
                            <div className="post-box-scontent">
                                <h3>{item.name}</h3>
                                <p className="desc">{item.desc.short} ...</p>
                            </div>
                            <div className="post-box-scontent">
                            <p className="price"><span className="curentcy">฿</span>{priceFormat(current)}<span className="curentcy dot">.00</span></p>
                            </div>
                            <div className="post-box-scontent">
                                <Clock secondsToHms={secondsToHms} timeNows={timeNows}  />
                            </div>
                            <div className="post-box-scontent">
                                
                            <ul className="post-box-step">
                                <li>{item.bid.bidStep}<span className="info">Increment</span></li>
                                <li>{item.bid.count}<span className="info">Bidding</span></li>
                            </ul>
                            </div>
                        </div>
                    </Link>
                </Animated.div>
            </div>
        )
    }
}

export default Sellingarea
