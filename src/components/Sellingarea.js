import React, { Component } from 'react'
import * as Animated from "animated/lib/targets/react-dom";
import { Link } from 'react-router-dom'
import Clock from './Clock'

class Sellingarea extends Component {

    render() {
        let {handleClose, style, item, timeNows, current, secondsToHms} = this.props
        return (
            <div className="small-6 medium-4 large-3 columns post-box">
                <Animated.div style={style}>
                    <Link onClick={handleClose} to={'/item/'+ item._id} >
                        <div className="post-box-top">
                            <img src={item.img} alt=""/>
                        </div>
                        <div className="post-box-content">
                            <h3>{item.name}</h3>
                            <p className="desc">{item.desc.short.slice(0,65)} ...</p>
                            <Clock secondsToHms={secondsToHms} timeNows={timeNows}  />
                            <p className="price">{current}<span className="curentcy">Bath</span></p>
                            <button><i className="fa fa2x "></i></button>
                        </div>
                    </Link>
                </Animated.div>
            </div>
        )
    }
}

export default Sellingarea
