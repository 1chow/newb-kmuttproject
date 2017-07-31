import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'
import ItemL from './ItemL'
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';

class Category extends Component {
  render(){
    return (
      <option value={this.props.name}>{this.props.name}</option>
    );
  }
}


class Edit extends Component {
  constructor () {
    super();
    this.state = {
      User:'',
      productname : '',
      productimage:'',
      productimageURL:'',
      firstbit:'',
      catagoriesselect:'', 
      desc: '',
      timeStart: moment(),
      timeEnd: moment(),
      boundedTime:'',
      catagories:[],
      Error: null,
    }
  }

  componentDidMount() {
     let user = firebase.auth().currentUser;
        if (user) {
        this.setState({
        User: user.uid
        })}
    firebase.database().ref().child('catagories').on('value', dataSnapshot => {
      let catagories = [];
      dataSnapshot.forEach( childSnapshot => {
        let category = childSnapshot.val();
        category['.key'] = childSnapshot.key;
        catagories.push(category);
      })
      this.setState({
        catagories: catagories
      })
    })
  }

  componentWillUnmount() {
    firebase.database().ref().child('catagories').off();
    this.setState({registerError: null })
  }

  
  handleNewItemSubmit = (e) => {
    e.preventDefault();
    this.dbItems = firebase.database().ref().child('items');
    if (this.state.productname && 
      this.state.productname.trim().length !== 0 &&
       this.state.desc.trim().length &&
        this.state.catagoriesselect &&
         this.state.productimageURL.length !== 0 &&
          this.state.boundedTime.lenght !== 0 &&
           this.state.timeStart.lenght !== 0 &&
            this.state.timeEnd.lenght !== 0) 
      {
        this.dbItems.push({
        name: this.state.productname,
        catagory: this.state.catagoriesselect,
        isActive: 1,
        desc:{
              short: this.state.desc.slice(0,32),
              fullHeader: this.state.desc.slice(0,16),
              fullDesc : this.state.desc
        },
        bid:{
            current : this.state.firstbit,
            endTime: this.state.timeEnd.format('x'),
            startTime: this.state.timeStart.format('x'),
        },
        img: this.state.productimageURL,
        bouded : this.state.boundedTime,
        own : this.state.User,
        timeNow : new Date().getTime()
      })
      .then(snapshot => {
            firebase.database().ref('/items/' + snapshot.key + '/bidList').push({
              userId : '',
              bid : this.state.firstbit,
              bidTimestamp : this.state.timeStart.format('x')
            });
        });
      this.setState({
        productname: '',
        catagoriesselect:'',
        desc: '',
      })
    } else this.setState({Error: 'Please filled a valid form' })
  }

  onNewItemChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUploadError = (error) => {
      this.setState({isUploading: false})
      console.error(error)
  }
  handleUploadSuccess = (filename) => {
      this.setState({productimage: filename, progress: 100, isUploading: false});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL: url}))
  }

  handleChange = (timeStart) => {
    this.setState({
      timeStart:timeStart
    });
  }

   handleChange2 = (timeEnd) => {
    this.setState({
      timeEnd:timeEnd
    });
  }


  render() {
    const shortcuts = {
      'Today': moment(),
      'Yesterday': moment().subtract(1, 'days'),
      'Clear': ''
    };
    return (
        <div className="row">
            <div className="small-12 columns">
              <h1>ADD Product</h1>
              <p>to Catagories</p>
              <div className="hr-text-center"><hr/></div>
            </div>
          <div className="small-12 columns profile-main">
            { this.state.Error &&
              <div className="small-12 columns">
              <div className="small-12 columns">
                <div className="alert callout">
                  <p><i className="fi-alert"></i>{this.state.Error}</p>
                </div>
              </div>
              </div>
            }
            <form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
             <div className="small-12 medium-6 columns">
                <div className="small-12 columns">
                  <label>Product Name
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.productname } name="productname"/>
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
                      <input className="input-group-field" type="number" onChange={ this.onNewItemChange } value={ this.state.firstbit } name="firstbit"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Bounded Time
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" type="number" required pattern="number" onChange={ this.onNewItemChange } value={ this.state.boundedTime } name="boundedTime" />
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time Start
                    <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeStart}
                      onChange={this.handleChange}>
                      <input onChange={this.handleChange} name="timeStart" type="text" value={this.state.timeStart.format('x')} />
                    </DatetimePickerTrigger>
                {/*    <input type="text" placeholder="Timestamp" aria-describedby="help-signup" required pattern="text" value={ this.state.timeStart } name="timeStart" readOnly/> */}        
                  </label>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time End
                      <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeEnd}
                      onChange={this.handleChange2}>
                      <input onChange={this.handleChange2} name="timeEnd" type="text" value={this.state.timeEnd.format('x')} />
                    </DatetimePickerTrigger>
                  </label>
                </div>
              </div>
              <div className="small-12 medium-6 columns">
                <div className="small-12 columns img-uploader">
                   <label>Product Image
                    <div className="box-img">
                        <label className="button btn-file">
                        + ADD Photo
                            <ImageUploader
                                name="avatar"
                                storageRef={firebase.storage().ref('images')}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress}
                            />
                        </label>
                     </div>
                    </label>
                </div>
                <div className="small-12 columns">
                    <label>Catagory
                      <select id="select" required onChange={ this.onNewItemChange } 
                        value={ this.state.catagoriesselect || "" } name="catagoriesselect">
                        <option value=''>Plese Select Category</option>
                        {this.state.catagories.map((category) => {
                            return ( 
                            <Category key={category.icon} dbkey={category['.key']}  {...category} />
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
             {this.state.productimageURL &&
                            <img src={this.state.productimageURL} alt="PreviewPic" />
              }
        </div>
    );
  }
}


export default Edit 