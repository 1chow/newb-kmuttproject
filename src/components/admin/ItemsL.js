import React, { Component } from 'react'
import * as firebase from 'firebase'

class ItemsL extends Component {
  constructor () {
    super();
    this.state = {
      items: [],
    };
    this.dbItems = firebase.database().ref().child('items');
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    this.dbItems.on('value', dataSnapshot => {
      let items = [];
        dataSnapshot.forEach( childSnapshot => {
        let category = childSnapshot.val();
        category['key'] = childSnapshot.key;
        items.push(category);
      });

      this.setState({
        items: items
      })
    });
  }

  componentWillUnmount() {
    this.dbItems.off();
  }

  removeItem(key){
    if (window.confirm("Do you want to remove this?") === true) {
      this.dbItems.child(key).remove();
    } 
  }

  render() {
    return this.state.items ? (
      <div className="row">
          <div className="row auct-from-warp admin-table">
              <table className="hover">
                <tbody>
                <tr>
                    <td width="40"></td>
                    <td width="210">ID</td>
                    <td className="show-for-large" width="210">Name</td>
                    <td className="show-for-large" width="150">Categories</td>
                    <td className="show-for-large" width="150">Start</td>
                    <td className="show-for-large" width="150">End</td>
                    <td>Delete</td>
                </tr>
                {this.state.items.map((item,i) => {
                    return ( 
                      <tr key={i}>
                          <td><i className={"fa fa-check-circle-o fa-2x" }></i></td>
                          <td>{item.key}</td>
                          <td className="show-for-large">{item.name}</td>
                          <td className="show-for-large">{item.catagory}</td>
                          <td className="show-for-large">{this.props.convertTimeM(item.bid.startTime)}</td>
                          <td className="show-for-large">{this.props.convertTimeM(item.bid.endTime)}</td>
                          <td><button onClick={()=> this.removeItem(item.key)} ><i className="fa fa-trash"></i></button></td>
                      </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
       </div>
    ) : null
  }
}

 
export default ItemsL