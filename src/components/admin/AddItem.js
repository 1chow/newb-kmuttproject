import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'
//import ItemsL from './ItemsL'
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
      timeEnd: moment().add(1, 'days'),
      boundedTime:'',
      catagories:[],
      productnameErr: null,
      descErr:null,
      firstbitErr:null,
      catagoriesErr:null,
      imageErr:null,
      timestartErr:null,
      timeendErr:null,
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
    this.setState({
      productnameErr: null,
      descErr:null,
      firstbitErr:null,
      catagoriesErr:null,
      imageErr:null,
      timestartErr:null,
      timeendErr:null,
    })
  }

  
  handleNewItemSubmit = (e) => {
    e.preventDefault();
    this.dbItems = firebase.database().ref().child('items');
    this.setState({
      productnameErr: null,
      descErr:null,
      firstbitErr:null,
      catagoriesErr:null,
      imageErr:null,
      timestartErr:null,
      timeendErr:null,
    })
    let test_name = this.nameValidate(this.state.productname)
    let test_desc = this.descValidate(this.state.desc)
    let test_firstbit = this.firstbitValidate(this.state.firstbit)
    let test_catagories = this.catagoriesValidate(this.state.catagoriesselect)
    let test_image = this.productimageValidate(this.state.productimageURL)
    let test_timestart = this.timestartValidate(this.state.timeStart)
    let test_timeend = this.timeendValidate(this.state.timeEnd)
    let isValid = test_name        &&
                  test_desc        &&
                  test_firstbit    &&
                  test_catagories  &&
                  test_image       &&
                  test_timestart   &&
                  test_timeend
    if (isValid === true) {
        this.props.triggler('alert','good','Your Item has create','fa-check-circle')
        this.addItem()
    }
  }

 timestartValidate = input => {
		if(input.lenght === 0){
			this.setState({timestartErr:"Pls select start time"})
			setTimeout(() => this.setState({timestartErr:null}),5000)
			return false
		} else return true
  }

  timeendValidate = input => {
		if(input.lenght === 0){
			this.setState({timeendErr:"Pls select start end"})
			setTimeout(() => this.setState({timeendErr:null}),5000)
			return false
		} else return true
  }


  productimageValidate = input => {
		if(input === ''){
			this.setState({imageErr:"Pls upload image"})
			setTimeout(() => this.setState({imageErr:null}),5000)
			return false
		} else return true
  }

  catagoriesValidate = input => {
		if(!input){
			this.setState({catagoriesErr:"Pls select catagoriey"})
			setTimeout(() => this.setState({catagoriesErr:null}),5000)
			return false
		} else return true
  }

  nameValidate = input => {
		if(input.trim().length === 0){
			this.setState({productnameErr:"Productname was empty"})
			setTimeout(() => this.setState({productnameErr:null}),5000)
			return false
		} else if(this.regCharacter(input.trim()) === false) {
			this.setState({productnameErr:"Productname must be Character"})
			setTimeout(() => this.setState({productnameErr:null}),5000)
			return false
		} else return true
  }
  
  descValidate = input => {
		if(input.trim().length === 0){
			this.setState({descErr:"Description was empty"})
			setTimeout(() => this.setState({descErr:null}),5000)
			return false
		} else return true
  }
  
  firstbitValidate = input => {
		if(input.trim().length === 0){
			this.setState({firstbitErr:"Firstbit was empty"})
			setTimeout(() => this.setState({firstbitErr:null}),5000)
			return false
		} else if(input.trim().length >= 10) {
			this.setState({firstbitErr:"length >= 10"})
			setTimeout(() => this.setState({firstbitErr:null}),5000)
			return false
		} else if(input < 1) {
			this.setState({firstbitErr:"Firstbit must be at least 1฿"})
			setTimeout(() => this.setState({firstbitErr:null}),5000)
			return false
		} else if(input%Math.floor(input) !== 0) {
			this.setState({firstbitErr:"Firstbit must be Integer"})
			setTimeout(() => this.setState({firstbitErr:null}),5000)
			return false
		} else return true
  }

  regCharacter = pw => {
		let re = /^[-_a-zA-Z0-9.]+$/
		return re.test(pw);
	}

  addItem = () => {
    this.dbItems.push({
      name: this.state.productname.slice(0,50),
      catagory: this.state.catagoriesselect,
      isActive: 1,
      desc:{
            short: this.state.desc.slice(0,32),
            fullHeader: this.state.desc.slice(0,16),
            fullDesc : this.state.desc.slice(0,200)
      },
      bid:{
          current : parseInt(this.state.firstbit,10),
          maxBid : parseInt((this.state.firstbit - 1),10),
          maxBidTime : parseInt(this.state.timeStart.format('x'),10),
          openBid : parseInt(this.state.firstbit,10),
          endTime: parseInt(this.state.timeEnd.format('x'),10),
          startTime: parseInt(this.state.timeStart.format('x'),10),
          userName : '',
          userId : ''
      },
      img: this.state.productimageURL,
      own : this.state.User
      
    })
    .then(snapshot => {
          firebase.database().ref('/items/' + snapshot.key + '/bidList').push({
            userId : '',
            userName : '',
            bid : parseInt(this.state.firstbit,10),
            bidTimestamp : this.state.timeStart.format('x'),
            auto : 0
          })
          .then(   
            this.setState({
                User:'',
                productname : '',
                productimage:'',
                productimageURL:'',
                firstbit:'',
                catagoriesselect:'', 
                desc: '',
                timeStart: moment(),
                timeEnd: moment().add(1, 'days'),
                boundedTime:'',
                catagories:[],
                productnameErr: null,
                descErr:null,
                firstbitErr:null,
                catagoriesErr:null,
                imageErr:null,
                timestartErr:null,
                timeendErr:null,
              })
          )
      })
  }

  onNewItemChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleUploadStart = () => {
    this.setState({productimageURL: null})
    this.setState({isUploading: true})
  }

  handleProgress = () => {
    this.state.productimageURL !== null && 
     this.setState({isUploading: false})
  }

  handleUploadError = (error) => {
      this.setState({
        isUploading: false,
        catagoriesErr: error,
      })
  }
  handleUploadSuccess = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL: url,isUploading: false}))
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

  addMockup = () => {
    let timeEnd = parseInt(this.state.timeStart.format('x'),10) + 20000
    this.dbItems = firebase.database().ref().child('items');
    this.dbItems.push({
      name: "MockUp :)",
      catagory: "House Hold",
      isActive: 1,
      desc:{
            short: "I'm come from the hell",
            fullHeader: "Hi Man,I'm come from the hell",
            fullDesc : "Hi Man,I'm come from the hell"
      },
      bid:{
          current : parseInt(50,10),
          maxBid : parseInt((50 - 1),10),
          maxBidTime : parseInt(this.state.timeStart.format('x'),10),
          openBid : parseInt(50,10),
          endTime: parseInt(timeEnd,10),
          startTime: parseInt(this.state.timeStart.format('x'),10),
          userName : '',
          userId : ''
      },
      img: "https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2Fa4a9443d-099f-4e24-bce0-6c5b3331c18c.jpg?alt=media&token=ef33603d-1a09-4292-8ec4-e1402afd51ab",
      own : this.state.User
    })
    .then(snapshot => {
      firebase.database().ref('/items/' + snapshot.key + '/bidList').push({
        userId : '',
        userName : '',
        bid : parseInt(50,10),
        bidTimestamp : this.state.timeStart.format('x'),
        auto : 0
      })
    })
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
            <form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
             <div className="small-12 medium-6 columns">
                <div className="small-12 columns">
                  <label>Product Name
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.productname } name="productname"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                  { this.state.productnameErr &&
										<div className="alert callout">
											<p><i className="fi-alert"></i>{this.state.productnameErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                  <label>Product Description
                    <textarea  type="text" placeholder="Product Description Here" aria-describedby="help-signup" id="" rows="5" required pattern="text"
                    onChange={ this.onNewItemChange } value={ this.state.desc } name="desc" ></textarea>
                    <span className="form-error">Yo, Product Description required!!</span>
                  </label>
                  { this.state.descErr &&
										<div className="alert callout">
											<p><i className="fi-alert"></i>{this.state.descErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                  <label>First Bit
                    <div className="input-group">
                      <span className="input-group-label">฿</span>
                      <input className="input-group-field" type="number" onChange={ this.onNewItemChange } value={ this.state.firstbit } name="firstbit"/>
                    </div>
                  </label>
                  { this.state.firstbitErr &&
										<div className="alert callout">
											<p><i className="fi-alert"></i>{this.state.firstbitErr}</p>
										</div>
									}
                </div>

                <div className="small-12 medium-6 columns">
                  <label>Time Start
                    <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeStart}
                      onChange={this.handleChange}>
                      <input onChange={this.handleChange} name="timeStart" readOnly type="text" value={this.state.timeStart.format('YYYY-MM-DD HH:mm')} />
                    </DatetimePickerTrigger>
                {/*    <input type="text" placeholder="Timestamp" aria-describedby="help-signup" required pattern="text" value={ this.state.timeStart } name="timeStart" readOnly/> */}        
                  </label>
                  { this.state.timestartErr &&
                      <div className="alert callout">
                        <p><i className="fi-alert"></i>{this.state.timestartErr}</p>
                      </div>
                    }
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time End
                      <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeEnd}
                      onChange={this.handleChange2}>
                      <input onChange={this.handleChange2} name="timeEnd" readOnly type="text" value={this.state.timeEnd.format('YYYY-MM-DD HH:mm')} />
                    </DatetimePickerTrigger>
                  </label>
                  { this.state.timeendErr &&
                      <div className="alert callout">
                        <p><i className="fi-alert"></i>{this.state.timeendErr}</p>
                      </div>
                    }
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
                        {this.state.isUploading  === true ?
                            <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                          : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                        }
                        {this.state.productimageURL && 
                          <img src={this.state.productimageURL} alt="PreviewPic" />
                        }
                     </div>
                    </label>
                    { this.state.imageErr &&
                      <div className="alert callout">
                        <p><i className="fi-alert"></i>{this.state.imageErr}</p>
                      </div>
                    }
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
                    { this.state.catagoriesErr &&
                      <div className="alert callout">
                        <p><i className="fi-alert"></i>{this.state.catagoriesErr}</p>
                      </div>
                    }
                </div>
                <div className="small-12 columns admin-from-btm">
                  <button className="button success" type="submit" value="Submit">ADD AUCTION</button>
                </div>
              </div>
            </form>
          </div>
          <div className="small-12 columns profile-main">
            {/*<ItemsL/>*/}
            <button onClick={this.addMockup}>Add Mock Item</button>  
          </div>
        </div>
    );
  }
}


export default Edit 