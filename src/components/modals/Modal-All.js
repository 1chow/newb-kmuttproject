import React from 'react'

const Allinone = props => (
    
        <div className="modal-core modal-small modal-message">
            <div className="row modal-core-head">
                <button onClick={props.close} className="close"><i className="fa fa-times"></i></button>
            </div>
            {
                props.feel === 'bad' ?
                    <div className="row">
                        <div className="small-12 medium-11 small-centered msg-box">
                            <i className={'fa ' + props.icon + ' fail'} style={{color:'#ff6060'}}></i>
                            <p>{props.message}</p>
                            {/*<button className="button success" type="submit" value="Submit">Login !!</button>*/}
                        </div>
                    </div> :
                    <div className="row">
                        <div className="small-12 medium-11 small-centered msg-box">
                            <i className={"fa " + props.icon + " success"}></i>
                            <p>{props.message}</p>
                            {/*<button className="button success" type="submit" value="Submit">Login !!</button>*/}
                        </div>
                    </div>
            }
        </div>
)

export default Allinone
