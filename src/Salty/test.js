import React from 'react'
import { Link } from "react-router-dom";

const Test = () => (
    <Link to='/projects/1'>
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
)

export default Test
