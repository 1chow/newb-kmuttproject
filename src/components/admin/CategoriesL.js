import React, { Component } from 'react'
import * as firebase from 'firebase'

class CategoryL extends Component {
  render(){
    return (
        
          <tr>
              <td><i className={"fa " + this.props.icon + " fa-2x" }></i></td>
              <td>{this.props.name}</td>
              <td><button onClick={()=> this.props.hell(this.props.dbkey,this.props.name)} ><i className="fa fa-trash"></i></button></td>
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

  removeItem(key,name){
    if (window.confirm("Do you want to remove this?") === true) {
      if(this.props.items.filter( item => item.catagory === name).length === 0){
        this.dbItems.child(key).remove();
        this.props.triggler('alert','good','Your catagory was delete','fa-check-circle')
      } else this.props.triggler('alert','bad','That catagory was Item','fa-exclamation')
    } 
    
       
    
    
  }

  render() {
    return (
      <div className="row">
          <div className="row auct-from-warp admin-table admin-cat-table">
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