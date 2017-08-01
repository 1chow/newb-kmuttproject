import React, { Component } from 'react'
import * as firebase from 'firebase'
import moment from 'moment';

class CategoryL extends Component {
  render(){
    return (
        
          <tr>
              <td><i className={"fa " + this.props.icon + " fa-2x" }></i></td>
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
    if (window.confirm("Do you want to remove this?") === true) {
      this.dbItems.child(key).remove();
    }  
  }

  render() {
    return (
      <div className="row">
          <div className="row auct-from-warp admin-table">
              <table className="hover unstriped">
                <tbody>
                <tr>
                    <td>ICON</td>
                    <td>Categories Name</td>
                    <td>Delete</td>
                </tr>
                {this.state.categories.map((category) => {
                  return ( 
                    <CategoryL key={category['.key']} dbkey={category['.key']} hell={this.removeItem} {...category} />
                    );})}
                </tbody>
              </table>
            </div>
       </div>
    );
  }
}

 
export default CategoriesL