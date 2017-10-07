import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'
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
      productimageURL2:null,
      productimageURL3:null,
      productimageURL4:null,
      firstbit:'',
      bidStep:'',
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
      bidstepErr:null,
    }
  }

  componentDidMount() {
    let {name,  desc, firstBid,  bidStep,  timeStart, timeEnd, catagory, image} = this.props
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
    if(name && desc && firstBid &&  bidStep &&  timeStart && timeEnd && catagory && image){
      this.setState({
        productname : name,
        firstbit : firstBid,
        bidStep : bidStep,
        catagoriesselect : catagory, 
        desc : desc,
        timeStart:moment(timeStart),
        timeEnd:moment(timeEnd),
        productimageURL:image[0],
        productimageURL2:image[1],
        productimageURL3:image[2],
        productimageURL4:image[3],
      })
    }
  }

  componentWillUnmount() {
    firebase.database().ref().child('catagories').off()
    firebase.database().ref().child('items').off()
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
      bidstepErr:null,
    })
    let test_name = this.nameValidate(this.state.productname)
    let test_desc = this.descValidate(this.state.desc)
    let test_firstbit = this.firstbitValidate(this.state.firstbit)
    let test_catagories = this.catagoriesValidate(this.state.catagoriesselect)
    let test_image = this.productimageValidate(this.state.productimageURL)
    let test_timestart = this.timestartValidate(this.state.timeStart)
    let test_timeend = this.timeendValidate(this.state.timeEnd)
    let test_bidstep = this.bidstepValidate(this.state.bidStep)
    let isValid = test_name        &&
                  test_desc        &&
                  test_firstbit    &&
                  test_catagories  &&
                  test_image       &&
                  test_timestart   &&
                  test_timeend     &&
                  test_bidstep
    if (isValid === true) {
        if(this.props.name){
          if (window.confirm("Do you want to edit this item?") === true) {
          this.props.triggler('alert','good','Edit','fa-check-circle')
          this.editItem()
          }
        } else {
          this.props.triggler('alert','good','Your Item has create','fa-check-circle')
          this.addItem()
        }
    }
  }

  bidstepValidate = input => {
    if(String(input).trim().length === 0){
			this.setState({bidstepErr:"bid increments was empty"})
			setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(String(input).trim().length >= 10) {
			this.setState({bidstepErr:"it's over Bid increments"})
			setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(input < 1) {
			this.setState({bidstepErr:"bid increments must be at least 1 THB"})
			setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(input%Math.floor(input) !== 0) {
			this.setState({bidstepErr:"bid increments must be amount of money"})
			setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else return true
  }

  timestartValidate = input => {
      if(input.lenght === 0){
        this.setState({timestartErr:"Pls select start time"})
        setTimeout(() => this.setState({timestartErr:null}),10000)
        return false
      } else return true
    }

    timeendValidate = input => {
      if(input.lenght === 0){
        this.setState({timeendErr:"Pls select start end"})
        setTimeout(() => this.setState({timeendErr:null}),10000)
        return false
      } else if(input <= this.state.timeStart){
        this.setState({timeendErr:"Time start <= Time end"})
        setTimeout(() => this.setState({timeendErr:null}),5000)
        return false
      } else return true
    }


    productimageValidate = input => {
      if(input === ''){
        this.setState({imageErr:"Pls upload image"})
        setTimeout(() => this.setState({imageErr:null}),10000)
        return false
      } else return true
    }

    catagoriesValidate = input => {
      if(!input){
        this.setState({catagoriesErr:"Pls select catagoriey"})
        setTimeout(() => this.setState({catagoriesErr:null}),10000)
        return false
      } else return true
    }

    nameValidate = input => {
      if(input.trim().length === 0){
        this.setState({productnameErr:"Productname was empty"})
        setTimeout(() => this.setState({productnameErr:null}),10000)
        return false
      } else if(this.regCharacter(input.trim()) === false) {
        this.setState({productnameErr:"Productname must be Character"})
        setTimeout(() => this.setState({productnameErr:null}),10000)
        return false
      } else return true
    }
    
    descValidate = input => {
      if(input.trim().length === 0){
        this.setState({descErr:"Description was empty"})
        setTimeout(() => this.setState({descErr:null}),10000)
        return false
      } else return true
    }
    
    firstbitValidate = input => {
      if(String(input).trim().length === 0){
        this.setState({firstbitErr:"Firstbit was empty"})
        setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(String(input).trim().length >= 10) {
        this.setState({firstbitErr:"length >= 10"})
        setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(input < 1) {
        this.setState({firstbitErr:"Firstbit must be at least 1฿"})
        setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(input%Math.floor(input) !== 0) {
        this.setState({firstbitErr:"Firstbit must be Integer"})
        setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else return true
    }

    regCharacter = pw => {
      let re = /^[a-zA-Z0-9_ ]+$/
      return re.test(pw);
    }

    addItem = () => {
      this.dbItems.push({
        name: this.state.productname.slice(0,50),
        catagory: this.state.catagoriesselect,
        isActive: 1,
        desc:{
              short: this.state.desc.slice(0,350),
              fullHeader: this.state.productname,
              fullDesc : this.state.desc
        },
        bid:{
            current : parseInt(this.state.firstbit,10),
            maxBid : parseInt((this.state.firstbit - this.state.bidStep),10),
            maxBidTime : parseInt(this.state.timeStart.format('x'),10),
            openBid : parseInt(this.state.firstbit,10),
            bidStep: parseInt(this.state.bidStep,10),
            endTime: parseInt(this.state.timeEnd.format('x'),10),
            startTime: parseInt(this.state.timeStart.format('x'),10),
            userName : '',
            userId : ''
        },
        img: this.state.productimageURL,
        img_:{
          0 : this.state.productimageURL,
          1 : this.state.productimageURL2,
          2 : this.state.productimageURL3,
          3 : this.state.productimageURL4,
        },
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
                  productimageURL2:'',
                  productimageURL3:'',
                  productimageURL4:'',
                  firstbit:'',
                  bidStep:'',
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
                  bidstepErr:null,
                })
            )
        })
    }

    editItem = () => {
      firebase.database().ref('items').child(this.props.id).update({
        name: this.state.productname.slice(0,50),
        catagory: this.state.catagoriesselect,
        desc:{
              short: this.state.desc.slice(0,350),
              fullHeader: this.state.productname,
              fullDesc : this.state.desc
        },
        img: this.state.productimageURL,
        img_:{
          0 : this.state.productimageURL,
          1 : this.state.productimageURL2 || null,
          2 : this.state.productimageURL3 || null,
          3 : this.state.productimageURL4 || null,
        }
      })
      .then( snapshot => {
        firebase.database().ref('/items/' + this.props.id + '/bid').update({
          current : parseInt(this.state.firstbit,10),
          bidStep: parseInt(this.state.bidStep,10),
          endTime: parseInt(this.state.timeEnd.format('x'),10),
          startTime: parseInt(this.state.timeStart.format('x'),10),
        })
      })
    }

    onNewItemChange = (e) => {
      this.setState({ [e.target.name]: e.target.value })
    }

    handleUploadStart = () => {
      this.setState({productimageURL: null})
      this.setState({isUploading: true})
    }

    handleUploadStart2 = () => {
      this.setState({productimageURL2: null})
      this.setState({isUploading2: true})
    }

    handleUploadStart3 = () => {
      this.setState({productimageURL3: null})
      this.setState({isUploading3: true})
    }

    handleUploadStart4 = () => {
      this.setState({productimageURL4: null})
      this.setState({isUploading4: true})
    }

    handleProgress = () => {
      this.state.productimageURL !== null && 
      this.setState({isUploading: false})
    }

    handleProgress2 = () => {
      this.state.productimageURL2 !== null && 
      this.setState({isUploading2: false})
    }

    handleProgress3 = () => {
      this.state.productimageURL3 !== null && 
      this.setState({isUploading3: false})
    }

    handleProgress4 = () => {
      this.state.productimageURL4 !== null && 
      this.setState({isUploading4: false})
    }

    handleUploadError = (error) => {
        this.setState({
          isUploading: false,
          imageErr: error,
        })
        setTimeout(() => this.setState({imageErr:null}),10000)
    }

    handleUploadError2 = (error) => {
        this.setState({
          isUploading2: false,
          imageErr: error,
        })
        setTimeout(() => this.setState({imageErr:null}),10000)
    }

    handleUploadError3 = (error) => {
        this.setState({
          isUploading3: false,
          imageErr: error,
        })
        setTimeout(() => this.setState({imageErr:null}),10000)
    }

    handleUploadError4 = (error) => {
      this.setState({
        isUploading4: false,
        imageErr: error,
      })
      setTimeout(() => this.setState({imageErr:null}),10000)
  }

  handleUploadSuccess = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL: url,isUploading: false}))
  }

  handleUploadSuccess2 = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL2: url,isUploading2: false}))
  }

  handleUploadSuccess3 = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL3: url,isUploading3: false}))
  }

  handleUploadSuccess4 = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({productimageURL4: url,isUploading4: false}))
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
      img_:{
        0 : "https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2Fa4a9443d-099f-4e24-bce0-6c5b3331c18c.jpg?alt=media&token=ef33603d-1a09-4292-8ec4-e1402afd51ab",
        1 : "https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2Fa4a9443d-099f-4e24-bce0-6c5b3331c18c.jpg?alt=media&token=ef33603d-1a09-4292-8ec4-e1402afd51ab",
        2 : "https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2Fa4a9443d-099f-4e24-bce0-6c5b3331c18c.jpg?alt=media&token=ef33603d-1a09-4292-8ec4-e1402afd51ab",
        3 : "https://firebasestorage.googleapis.com/v0/b/auctkmutt.appspot.com/o/images%2Fa4a9443d-099f-4e24-bce0-6c5b3331c18c.jpg?alt=media&token=ef33603d-1a09-4292-8ec4-e1402afd51ab"
      },
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
    let {name,isBided} = this.props
    const shortcuts = {
      'Today': moment(),
      'Yesterday': moment().subtract(1, 'days'),
      'Clear': ''
    };
    return (
        <div className="row">
          { !name &&
            <div className="small-12 columns">
              <h1>ADD Product</h1>
              <p>to Catagories</p>
              <div className="hr-text-center"><hr/></div>
            </div>
          }
          <div className="small-12 columns profile-main">
            <form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
             <div className="small-12 medium-6 columns">
                <div className="small-12 columns">
                  <label>Product Name
                    <input type="text" placeholder="Product Name" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.productname } name="productname"/>
                    <span className="form-error">Yo, Product name required!!</span>
                  </label>
                  { this.state.productnameErr &&
										<div className="alert-error">
											<p><i className="fa fa-times"></i> {this.state.productnameErr}</p>
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
										<div className="alert-error">
											<p><i className="fa fa-times"></i> {this.state.descErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                  <label>First Bit
                  { (isBided && Object.keys(isBided).length > 1) ? 
                    <div className="input-group">
                      <p>{ this.state.firstbit }</p>
                    </div>
                      :
                    <div className="input-group">
                       <span className="input-group-label">฿</span>
                       <input className="input-group-field" type="number" onChange={ this.onNewItemChange } value={ this.state.firstbit } name="firstbit"/>
                    </div>
                  }
                  </label>
                  { this.state.firstbitErr &&
										<div className="alert-error">
											<p><i className="fa fa-times"></i> {this.state.firstbitErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                  <label>Bid Increments
                  {(isBided && Object.keys(isBided).length > 1) ? 
                    <div className="input-group">
                      <p>{ this.state.bidStep }</p>
                    </div>
                      :
                    <div className="input-group">
                        <span className="input-group-label">฿</span>
                        <input className="input-group-field" type="number" onChange={ this.onNewItemChange } value={ this.state.bidStep } name="bidStep"/>
                    </div>
                  }
                  </label>
                  { this.state.bidstepErr &&
                      <div className="alert-error">
                        <p><i className="fa fa-times"></i> {this.state.bidstepErr}</p>
                      </div>
                    }
                </div>

                <div className="small-12 medium-6 columns">
                  <label>Time Start
                    <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeStart}
                      onChange={this.handleChange}
                      closeOnSelectDay="true"
                      >
                      <input name="timeStart" readOnly type="text" value={this.state.timeStart.format('YYYY-MM-DD HH:mm')} />
                    </DatetimePickerTrigger>      
                  </label>
                  { this.state.timestartErr &&
                      <div className="alert-error">
                        <p><i className="fa fa-times"></i> {this.state.timestartErr}</p>
                      </div>
                    }
                </div>
                <div className="small-12 medium-6 columns">
                  <label>Time End
                      <DatetimePickerTrigger
                      shortcuts={shortcuts} 
                      moment={this.state.timeEnd}
                      onChange={this.handleChange2}
                      closeOnSelectDay="true"
                      >
                      <input name="timeEnd" readOnly type="text" value={this.state.timeEnd.format('YYYY-MM-DD HH:mm')} />
                    </DatetimePickerTrigger>
                  </label>
                  { this.state.timeendErr &&
                      <div className="alert-error">
                        <p><i className="fa fa-times"></i> {this.state.timeendErr}</p>
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
                        {this.state.isUploading  === true  ?
                            <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                          : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                        }
                        {this.state.productimageURL && 
                          <img src={this.state.productimageURL} alt="PreviewPic" />
                        }
                     </div>
                     {this.state.productimageURL &&
                        <div className="box-img">
                            <label className="button btn-file">
                            + ADD Photo
                                <ImageUploader
                                    name="avatar"
                                    storageRef={firebase.storage().ref('images')}
                                    onUploadStart={this.handleUploadStart2}
                                    onUploadError={this.handleUploadError2}
                                    onUploadSuccess={this.handleUploadSuccess2}
                                    onProgress={this.handleProgress2}
                                />
                            </label>
                            {this.state.isUploading2  === true ?
                                <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                              : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                            }
                            {this.state.productimageURL2 && 
                              <img src={this.state.productimageURL2} alt="PreviewPic" />
                            }
                        </div>
                      }
                      {this.state.productimageURL2 &&
                        <div className="box-img">
                            <label className="button btn-file">
                            + ADD Photo
                                <ImageUploader
                                    name="avatar"
                                    storageRef={firebase.storage().ref('images')}
                                    onUploadStart={this.handleUploadStart3}
                                    onUploadError={this.handleUploadError3}
                                    onUploadSuccess={this.handleUploadSuccess3}
                                    onProgress={this.handleProgress3}
                                />
                            </label>
                            {this.state.isUploading3  === true ?
                                <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                              : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                            }
                            {this.state.productimageURL3 && 
                              <img src={this.state.productimageURL3} alt="PreviewPic" />
                            }
                        </div>
                      }
                      {this.state.productimageURL3 &&
                        <div className="box-img">
                            <label className="button btn-file">
                            + ADD Photo
                                <ImageUploader
                                    name="avatar"
                                    storageRef={firebase.storage().ref('images')}
                                    onUploadStart={this.handleUploadStart4}
                                    onUploadError={this.handleUploadError4}
                                    onUploadSuccess={this.handleUploadSuccess4}
                                    onProgress={this.handleProgress4}
                                />
                            </label>
                            {this.state.isUploading4  === true ?
                                <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                              : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                            }
                            {this.state.productimageURL4 && 
                              <img src={this.state.productimageURL4} alt="PreviewPic" />
                            }
                        </div>
                      }
                    </label>
                    { this.state.imageErr &&
                      <div className="alert-error">
                        <p><i className="fa fa-times"></i> {this.state.imageErr}</p>
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
                      <div className="alert-error">
                        <p><i className="fa fa-times"></i> {this.state.catagoriesErr}</p>
                      </div>
                    }
                </div>
                <div className="small-12 columns admin-from-btm">
                  {
                    !name ?
                    <button className="button success" type="submit" value="Submit">ADD AUCTION</button>
                    :
                    <button className="button success" type="submit" value="Submit">Edit</button>
                   }
                </div>
              </div>
            </form>
          </div>
          { !name &&
          <div className="small-12 columns profile-main">
            <button onClick={this.addMockup}>Add Mock Item</button>  
          </div>
          }
        </div>
    );
  }
}


export default Edit 