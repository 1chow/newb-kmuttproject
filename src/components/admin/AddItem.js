import React, { Component } from 'react'
import * as firebase from 'firebase'
import ItemL from './ItemL'
//import ImageUploader from 'react-firebase-image-uploader';

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
      catagoriesselect:'', 
      desc: '',
      catagories:[],
      Error: null 
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
  }

  
  handleNewItemSubmit = (e) => {
    e.preventDefault();
    this.dbItems = firebase.database().ref().child('items');
    if (this.state.productname && this.state.productname.trim().length !== 0 && this.state.desc.trim().length && this.state.catagoriesselect) {
      this.dbItems.push({
        name: this.state.productname,
        category: this.state.catagoriesselect,
        isActive: 1,
        desc:{
              short:this.state.desc,
              fullHeader:'Consectetur adipisicing elit. Est sed.',
              fullDesc :'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
        },
        bid:{
            current : '30',
            endTime: '1501448590662',
            open: 5,
            startTime: new Date().getTime(),
            step: 30,
        },
        img:['a', 'b', 'c'],
        bouded : 15,
        own : this.state.User,
        timenow: new Date().getTime(),
      })
      .then(snapshot => {
            firebase.database().ref('/items/' + snapshot.key + '/bidList').push({
              userId : '',
              bid : 30,
              bidTimestamp : new Date().getTime()
            });
            
            firebase.database().ref('/time').once("value" ,function(Csnapshot) {
              var fkTime = Csnapshot.val();
              var fk = fkTime.timeNow + ((7) * 60 * 1000)
              firebase.database().ref('/items/' + snapshot.key + '/bid').update({
                endTime: fk
              })
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
                      <input className="input-group-field" id="exampleNumberInput" type="number" onChange={ this.onNewItemChange } value={ this.state.prize } name="prize"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Bounded Time
                    <div className="input-group">
                      <span className="input-group-label">$</span>
                      <input className="input-group-field" id="exampleNumberInput" type="number" required pattern="number" onChange={ this.onNewItemChange } value={ this.state.reserveTime } name="reserveTime"/>
                    </div>
                  </label>
                  <span className="form-error" data-form-error-for="exampleNumberInput">Amount is required.</span>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time Start
                    <input type="text" placeholder="Timestamp" aria-describedby="help-signup" required pattern="text" onChange={ this.onNewItemChange } value={ this.state.timetoauct } name="timetoauct"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time End
                    <input type="text" placeholder="Timestamp" aria-describedby="help-signup" required pattern="text" onChange={ this.onNewItemChange } value={ this.state.timetoauct } name="timetoauct"/>
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
                        value={ this.state.catagoriesselect || "" } name="catagoriesselect">
                        <option value=''>Plese Select Category</option>
                        {this.state.catagories.map((category) => {
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