import React from 'react'
import { Link } from 'react-router-dom'
import * as Animated from "animated/lib/targets/react-dom";

class Item extends React.Component {
    shouldComponentUpdate(nextProps){
        if(this.props.identify !== nextProps.identify){
            
            return true
        } else { return false }
    }
    render() {
        return (
            <div className="small-6 medium-4 large-3 columns post-box">
                <Animated.div style={this.props.makeup}>
                    <Link to='/item/1'>
                        <div className="post-box-top">
                            <img src="http://dummyimage.com/300x300/292929/e3e3e3&text=Your Mom Goes to College" alt=""/>
                        </div>
                        <div className="post-box-content">
                            <h3>SaltyCamel</h3>
                            <p className="desc">Sweety</p>
                            <span className="timecount red">00:00:00</span>
                            <p className="price">999<span className="curentcy">Bath</span></p>
                            <button><i className="fa fa2x "></i></button>
                        </div>
                    </Link>
                </Animated.div>
            </div>
        )
    }
}

export default Item
