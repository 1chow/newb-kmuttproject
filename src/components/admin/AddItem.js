import React, { Component } from 'react'
import * as firebase from 'firebase'
import ItemL from './ItemL'
//import ImageUploader from 'react-firebase-image-uploader';

class Category extends Component {
  render(){
    return (
      <option value={this.props.dbkey}>{this.props.text}</option>
    );
  }
}


class Edit extends Component {
  constructor () {
    super();
    this.state = {
      newitemtext : '', 
      prize : '', 
      desc : '', 
      timetoauct : '', 
      status: '', 
      auctround: '', 
      categories: [], 
      categoriestype: null,
      User: '',
      ReserveBid:'',
      avatar: '',
      isUploading: false,
      progress: 0,
      avatarURL: '',
      reserveTime:''

    }
  }

  componentDidMount() {
     let user = firebase.auth().currentUser;
        if (user) {
        this.setState({
        User: user.email
        })}
    firebase.database().ref().child('items').on('value', dataSnapshot => {
      let categories = [];
      dataSnapshot.forEach( childSnapshot => {
        let category = childSnapshot.val();
        category['.key'] = childSnapshot.key;
        categories.push(category);
      })
      this.setState({
        categories: categories
      })
    })
  }

  componentWillUnmount() {
    firebase.database().ref().child('category').off();
  }

  
  handleNewItemSubmit = (e) => {
    this.dbItems = firebase.database().ref().child('items');
    this.categoryRef = firebase.database().ref().child('category');
    e.preventDefault();
    if (this.state.newitemtext && this.state.newitemtext.trim().length !== 0) {
      this.dbItems.push({
        text: this.state.newitemtext,
        prize : this.state.prize,
        desc : this.state.desc,
        startauct : new Date().getTime(),
        timetoauct : this.state.timetoauct,
        status: 1,
        auctround: 1,
        categories: this.state.categoriestype,
        User: this.state.User,
        Winner:'',
        ReserveBid: 0,
        ReserveUser:'',
        avatarURL: this.state.avatarURL,
        reserveTime: this.state.reserveTime
      })
      this.setState({
        newitemtext: '',
        prize : '',
        desc : '',
        timetoauct : '',
        status: '',
        auctround: '',
        ReserveBid:'',
        ReserveUser:'',
        avatarURL: '',
        avatar: '',
        isUploading: false,
        progress: 0,
      })
    }
  }

  onNewItemChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUploadStart = () => this.setState({isUploading: true, progress: 0})
  handleProgress = (progress) => this.setState({progress})
  handleUploadError = (error) => {
      this.setState({isUploading: false})
      console.error(error)
  }
  handleUploadSuccess = (filename) => {
      this.setState({avatar: filename, progress: 100, isUploading: false});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({avatarURL: url}))
  }

 
  render() {


    return (
        <div className="row">
            <div className="small-12 columns">
              <h1>ADD Product</h1>
              <p>to Catagories</p>
              <div className="hr-text-center"><hr/></div>
            </div>
          <div className="small-12 columns profile-main">
            <form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
             <div className="small-12 medium-6 columns">
                <div className="small-12 columns">
                  <label>Product Name
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.newitemtext } name="newitemtext"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
                <div className="small-12 columns">
                  <label>Product Description
                    <textarea  type="text" placeholder="Product Description Here" aria-describedby="help-signup" id="" rows="5" required pattern="text"
                    onChange={ this.onNewItemChange } value={ this.state.desc } name="desc" ></textarea>
                    <span className="form-error">Yo, Product Description required!!</span>
                  </label>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>First Bit
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" id="exampleNumberInput" type="number" required pattern="number" onChange={ this.onNewItemChange } value={ this.state.prize } name="prize"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Reserve time
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" id="exampleNumberInput" type="number" required pattern="number" onChange={ this.onNewItemChange } value={ this.state.reserveTime } name="reserveTime"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time Bit
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" onChange={ this.onNewItemChange } value={ this.state.timetoauct } name="timetoauct"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time End
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" onChange={ this.onNewItemChange } value={ this.state.timetoauct } name="timetoauct"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
              </div>
              <div className="small-12 medium-6 columns">
                <div className="small-12 columns img-uploader">
                   <label>Product Image
                    <div className="box-img">
                        {this.state.isUploading &&
                            <p>{this.state.progress}%</p>
                        }
                        {this.state.avatarURL &&
                            <img src={this.state.avatarURL} alt="PreviewPic" />
                        }
                        <label className="button btn-file">
                        + ADD Photo
                        {/*
                            <ImageUploader
                                name="avatar"
                                storageRef={firebase.storage().ref('images')}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress}
                            />
                        */}
                        </label>
                     </div>
                    </label>
                </div>
                <div className="small-12 columns">
                    <label>Catagory
                      <select id="select" required onChange={ this.onNewItemChange } 
                        value={ this.state.categoriestype || "" } name="categoriestype">
                        <option value=''></option>
                        {this.state.categories.map((category) => {
                            return ( 
                            <Category  key={ category['.key'] } dbkey={ category['.key'] }  {...category} />
                            );
                          })}
                      </select>
                    </label>
                </div>
                <div className="small-12 columns admin-from-btm">
                  <button className="button success" type="submit" value="Submit">ADD AUCTION</button>
                </div>
              </div>
            </form>
          </div>
          <div className="small-12 columns profile-main">
            <ItemL/>
          </div>
        </div>
    );
  }
}


export default Edit 