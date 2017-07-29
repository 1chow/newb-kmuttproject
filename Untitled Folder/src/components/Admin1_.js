import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as firebase from 'firebase'


class CategoryL extends Component {
  render(){
    return (
        
          <tr>
              <td><i className={"fa " + this.props.icon }></i></td>
              <td>{this.props.name}</td>
              <td><button onClick={()=> this.props.hell(this.props.dbkey)} ><i className="fa fa-trash"></i></button></td>
          </tr>
        
    );
  }
}

class CategoriesL extends Component {
  constructor () {
    super();
    this.state = {
      categories: [],
    };
    this.dbItems = firebase.database().ref().child('catagories');
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    this.dbItems.on('value', dataSnapshot => {
      let categories = [];
      dataSnapshot.forEach( childSnapshot => {
        let category = childSnapshot.val();
        category['.key'] = childSnapshot.key;
        categories.push(category);
      });

      this.setState({
        categories: categories
      });
    });
  }

  componentWillUnmount() {
    this.dbItems.off();
  }

  removeItem(key){
    this.dbItems.child(key).remove();
  }

  render() {
    var _this = this;
    return (
      <div className="row">
          <div className="row auct-from-warp">
                <div className="small-12 medium-12 columns">
                  <table className="hover unstriped">
                    <tbody>
                    <tr>
                        <td>ICON</td>
                        <td>Categories Name</td>
                        <td>Delete</td>
                    </tr>
                    {this.state.categories.map((category) => {
                      return ( 
                        <CategoryL dbkey={category['.key']} hell={this.removeItem} {...category} />
                        );})}
                    </tbody>
                  </table>
                </div>
              </div>
       </div>
    );
  }
}

 
export default CategoriesL