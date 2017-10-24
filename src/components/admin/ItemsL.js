import React, { Component } from 'react'
import * as firebase from 'firebase'
import Additem from './AddItem'
import { Link } from 'react-router-dom'

class ItemsL extends Component {
  constructor () {
    super();
    this.state = {
      items: [],
      activeKey: null,
    };
    this.dbItems = firebase.database().ref().child('items');
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
      let { items } = this.props
      let items_ = items.filter( a => a.isDelete === 1)
      this.setState({
        items:items_
      })
  }

  componentWillReceiveProps(nextProps) {
    let { items } = nextProps
    let items_ = items.filter( a => a.isDelete === 1)
    if(items_ !== null){
      this.setState({
        items:items_
      })
    }
  }

  removeItem(key){
    if (window.confirm("Do you want to remove this?") === true) {
      this.props.onDelete(key)
      this.dbItems.child(key).update({
        isDelete:0,
      })
      this.props.triggler('alert','good','Your item was deleted','fa-check-circle')
    } 
  }

  handleEdit = index => {
    this.state.activeKey === null ? (
      this.setState({activeKey:index})
    ) : (
      this.setState({activeKey:null})
    )
  }

  render() {
    return this.state.items ? (
      <div className="row">
          <div className="small-12 columns">
              <h1>Selling Items</h1>
              <p>Manage your products.</p>
              <div className="hr-text-center"><hr/></div>
          </div>
          <div className="row auct-from-warp admin-table">
              <table className="hover">
                <tbody>
                <tr>
                    <td width="50"></td>
                    <td width="100">Product</td>
                    <td className="show-for-large" width="100">Categories</td>
                    <td className="show-for-large" width="100">increment</td>
                    <td className="show-for-large" width="100">Open</td>
                    <td className="show-for-large" width="100">Price</td>
                    <td className="show-for-large" width="100">Win</td>
                    <td className="show-for-large" width="100">Start</td>
                    <td className="show-for-large" width="100">End</td>
                    <td width="50">Delete</td>
                    <td width="50">Edit</td>
                </tr>
                {this.state.items.map((item,i) => {
                    return ([
                      <tr key={i}>
                          { item.isActive === 1 ?
                            <td style={{color:'#22bb5b'}}><i className={"fa fa-check-circle-o fa-2x"}></i><p className="p-small" style={{color:'#22bb5b'}}>Now Bids</p></td> 
                            :
                            <td style={{color:'#ff0000'}}><i className={"fa fa-clock-o fa-2x"}></i><p className="p-small" style={{color:'#ff0000'}}>Time Out</p></td> 
                          }

                          <td className="thump">
                              <Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}><img className="admin-table-thump" src={item.img} alt="PreviewPic" />
                                <p className="p-name">{item.name}</p>
                                <p className="p-small">{item._id}</p>
                              </Link>
                          </td>
                          <td><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{item.catagory}</Link></td>
                          <td><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{item.bid.bidStep}.00 ฿</Link></td>
                          <td><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{item.bid.openBid}.00 ฿</Link></td>
                          <td><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{item.bid.current}.00 ฿</Link></td>
                          <td>
                  
                            { item.isActive !== 1 ?
                             (<Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}><i className="fa fa-trophy"></i> {item.bid.userName}</Link>) 
                            : 
                             (<Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}><i className="fa fa-clock-o" style={{color:'#22bb5b'}}></i> {item.bid.userName}</Link>)}
                             
                          </td>
                          <td className="show-for-large td-time"><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{this.props.convertTimeM(item.bid.startTime)}</Link></td>
                          <td className="show-for-large td-time"><Link style={{color:'#5e5e5e'}} to={'/item/'+item._id}>{this.props.convertTimeM(item.bid.endTime)}</Link></td>
                          <td><button onClick={() => this.removeItem(item._id)} ><i className="fa fa-trash"></i></button></td>

                          { item.isActive === 1 ?
                            <td><button onClick={() => this.handleEdit(i)} ><i className="fa fa-edit fa-edit-admin"></i></button></td>
                          :
                            <td><p className="p-small" style={{color:'#ff0000'}}>Time Out</p></td> 
                          }
                      </tr>,
                      <tr className={"admin-iteml-editable "+(this.state.activeKey === i ? null : 'none')}>
                        <td colSpan="10">
                        {this.state.activeKey === i &&
                          <Additem 
                            triggler={this.props.triggler}
                            name={item.name}
                            desc={item.desc.fullDesc}
                            shortDesc={item.desc.short}
                            firstBid={item.bid.openBid}
                            bidStep={item.bid.bidStep}
                            timeStart={item.bid.startTime}
                            timeEnd={item.bid.endTime}
                            catagory={item.catagory}
                            image={item.img_}
                            id={item._id}
                            isBided={item.bidList}
                            specific={item.spec}
                          />
                        }
                        </td>
                      </tr>
                    ])
                    })
                  }
                </tbody>
              </table>
            </div>
       </div>
    ) : <div className="row">
        <div className="small-12 columns">
                  <h1>Selling Items</h1>
                  <p>Manage your products.</p>
                  <div className="hr-text-center"><hr/></div>
        </div>
        <div className="page-404-chart page-404-container fade-animate">
          <div className="page-404">
            <p className="quote">Your auction history was empty list !!</p>
            <Link to="/" onClick={this.props.close} className="button success">Just Auction</Link>
          </div>
        </div>
      </div>
  }
}

 
export default ItemsL