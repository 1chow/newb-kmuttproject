import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker'
import RichTextEditor from 'react-rte'

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
      spec_select1:'',
      spec_select2:'',
      spec_select3:'',
      spec_detail1:'',
      spec_detail2:'',
      spec_detail3:'',
      spec_conditon:'',
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
      descPicErr:null,
      specErr:null,
      conditionErr:null,
      imageStack:1,
      editorValue: RichTextEditor.createEmptyValue()
    }
  }

  componentDidMount() {
    let {name,  desc, firstBid,  bidStep,  timeStart, timeEnd, catagory, image , specific} = this.props
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
        imageStack:Object.keys(image).length,
        specific: specific
      })
    }
  }

  componentWillUnmount() {
    firebase.database().ref().child('catagories').off()
    firebase.database().ref().child('items').off()
    if (this.timerHandle_name) {               
			clearTimeout(this.timerHandle_name);     
			this.timerHandle_name = 0;                
    }
    if (this.timerHandle_desc) {               
			clearTimeout(this.timerHandle_desc);     
			this.timerHandle_desc = 0;                
    }
    if (this.timerHandle_firstbit) {               
			clearTimeout(this.timerHandle_firstbit);     
			this.timerHandle_firstbit = 0;                
    }
    if (this.timerHandle_catagories) {               
			clearTimeout(this.timerHandle_catagories);     
			this.timerHandle_catagories = 0;                
    }
    if (this.timerHandle_image) {               
			clearTimeout(this.timerHandle_image);     
			this.timerHandle_image = 0;                
    }
    if (this.timerHandle_timestart) {               
			clearTimeout(this.timerHandle_timestart);     
			this.timerHandle_timestart = 0;                
    }
    if (this.timerHandle_timeend) {               
			clearTimeout(this.timerHandle_timeend);     
			this.timerHandle_timeend = 0;                
    }
    if (this.timerHandle_bidstep) {               
			clearTimeout(this.timerHandle_bidstep);     
			this.timerHandle_bidstep = 0;                
    }
    if (this.timerHandle_images) {               
			clearTimeout(this.timerHandle_images);     
			this.timerHandle_images = 0;                
    }
    if (this.timerHandle_fulldesc) {               
			clearTimeout(this.timerHandle_fulldesc);     
			this.timerHandle_fulldesc = 0;                
    }
    if (this.timerHandle_condition) {               
			clearTimeout(this.timerHandle_condition);     
			this.timerHandle_condition = 0;                
    }
    if (this.timerHandle_spec) {               
			clearTimeout(this.timerHandle_spec);     
			this.timerHandle_spec = 0;                
    }
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
      descPicErr:null,
      specErr:null,
      conditionErr:null,
    })
    let test_name = this.nameValidate(this.state.productname)
    let test_desc = this.descValidate(this.state.desc)
    let test_fulldesc = this.fulldescValidate(this.state.editorValue.toString('html'))
    let test_firstbit = this.firstbitValidate(this.state.firstbit)
    let test_catagories = this.catagoriesValidate(this.state.catagoriesselect)
    let test_image = this.productimageValidate(this.state.productimageURL)
    let test_images = this.productimagesValidate( 
                                                  this.state.imageStack,
                                                  this.state.productimageURL,
                                                  this.state.productimageURL2,
                                                  this.state.productimageURL3,
                                                  this.state.productimageURL4
                                                )
    let test_timestart = this.timestartValidate(this.state.timeStart)
    let test_timeend = this.timeendValidate(this.state.timeEnd)
    let test_bidstep = this.bidstepValidate(this.state.bidStep)
    let test_spec1 = this.specValidate(this.state.spec_select1 !== 'More...' ? this.state.spec_select1 : this.state.spec_select_add1,this.state.spec_detail1)
    let test_spec2 = this.specValidate(this.state.spec_select2 !== 'More...' ? this.state.spec_select2 : this.state.spec_select_add2,this.state.spec_detail2)
    let test_spec3 = this.specValidate(this.state.spec_select3 !== 'More...' ? this.state.spec_select3 : this.state.spec_select_add3,this.state.spec_detail3)
    let test_condition = this.conditionstepValidate(this.state.spec_conditon)
    let isValid = test_name        &&
                  test_desc        &&
                  test_firstbit    &&
                  test_catagories  &&
                  test_image       &&
                  test_timestart   &&
                  test_timeend     &&
                  test_bidstep     &&
                  test_images      &&
                  test_fulldesc    &&
                  test_spec1       &&
                  test_spec2       &&
                  test_spec3       &&
                  test_condition
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

  specValidate = (select,detail) => {
    if(detail.trim().length === 0){
      this.setState({specErr:"Specification detail was empty"})
      this.timerHandle_spec = setTimeout(() => this.setState({specErr:null}),10000)
      return false
    } else if(this.regCharacter(detail.trim()) === false) {
      this.setState({productnameErr:"Specification must be Character"})
      this.timerHandle_spec = setTimeout(() => this.setState({specErr:null}),10000)
      return false
    } else if(!select){
      this.setState({specErr:"Specification was empty"})
      this.timerHandle_spec = setTimeout(() => this.setState({specErr:null}),10000)
      return false
    } else if(select.trim().length === 0){
      this.setState({specErr:"Specification was empty"})
      this.timerHandle_spec = setTimeout(() => this.setState({specErr:null}),10000)
      return false
    } else return true
  }

  conditionstepValidate = input => {
    if(!input){
      this.setState({conditionErr:"Pls select condition"})
      this.timerHandle_condition = setTimeout(() => this.setState({conditionErr:null}),10000)
      return false
    } else return true
  }



  bidstepValidate = input => {
    if(String(input).trim().length === 0){
			this.setState({bidstepErr:"bid increments was empty"})
			this.timerHandle_bidstep = setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(String(input).trim().length >= 10) {
			this.setState({bidstepErr:"it's over Bid increments"})
			this.timerHandle_bidstep = setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(input < 1) {
			this.setState({bidstepErr:"bid increments must be at least 1 THB"})
			this.timerHandle_bidstep = setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else if(input%Math.floor(input) !== 0) {
			this.setState({bidstepErr:"bid increments must be amount of money"})
			this.timerHandle_bidstep = setTimeout(() => this.setState({bidstepErr:null}),10000)
			return false
		} else return true
  }

  timestartValidate = input => {
      if(input.lenght === 0){
        this.setState({timestartErr:"Pls select start time"})
        this.timerHandle_timestart = setTimeout(() => this.setState({timestartErr:null}),10000)
        return false
      } else return true
    }

    timeendValidate = input => {
      if(input.lenght === 0){
        this.setState({timeendErr:"Pls select start end"})
        this.timerHandle_timeend = setTimeout(() => this.setState({timeendErr:null}),10000)
        return false
      } else if(input <= this.state.timeStart){
        this.setState({timeendErr:"Time start <= Time end"})
        this.timerHandle_timeend = setTimeout(() => this.setState({timeendErr:null}),10000)
        return false
      } else return true
    }


    productimageValidate = input => {
      if(input === ''){
        this.setState({imageErr:"Pls upload image"})
        this.timerHandle_image = setTimeout(() => this.setState({imageErr:null}),10000)
        return false
      } else return true
    }

    productimagesValidate = (stack,pic1,pic2,pic3,pic4) => {
      switch (stack) {
        case 1:
          if(pic1 === ''){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else return true
        case 2:
          if(pic1 === ''){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic2 === null || pic2 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else return true
        case 3:
          if(pic1 === ''){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic2 === null || pic2 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic3 === null || pic3 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else  return true
        case 4:
          if(pic1 === ''){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic2 === null || pic2 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic3 === null || pic3 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else if(pic4 === null || pic4 === undefined){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else  return true
        default :
          if(pic1 === ''){
            this.setState({imageErr:"Pls upload image"})
            this.timerHandle_images = setTimeout(() => this.setState({imageErr:null}),10000)
            return false
          } else return true
      }
    }

    catagoriesValidate = input => {
      if(!input){
        this.setState({catagoriesErr:"Pls select catagoriey"})
        this.timerHandle_catagories = setTimeout(() => this.setState({catagoriesErr:null}),10000)
        return false
      } else return true
    }

    nameValidate = input => {
      if(input.trim().length === 0){
        this.setState({productnameErr:"Productname was empty"})
        this.timerHandle_name = setTimeout(() => this.setState({productnameErr:null}),10000)
        return false
      } else if(this.regCharacter(input.trim()) === false) {
        this.setState({productnameErr:"Productname must be Character"})
        this.timerHandle_name = setTimeout(() => this.setState({productnameErr:null}),10000)
        return false
      } else return true
    }

    fulldescValidate = input => {
      let a = input.trim().replace(/<\/?[^>]+(>|$)/g, "")
      let b = a.replace(/&nbsp;/g, '')
      if(b === ''){
        this.setState({descPicErr:"Full Description was empty"})
        this.timerHandle_fulldesc = setTimeout(() => this.setState({descPicErr:null}),10000)
        return false
      } else return true
    }
    
    descValidate = input => {
      if(input.trim().length === 0){
        this.setState({descErr:"Description was empty"})
        this.timerHandle_desc = setTimeout(() => this.setState({descErr:null}),10000)
        return false
      } else return true
    }
    
    firstbitValidate = input => {
      if(String(input).trim().length === 0){
        this.setState({firstbitErr:"Firstbit was empty"})
        this.timerHandle_firstbit = setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(String(input).trim().length >= 10) {
        this.setState({firstbitErr:"length >= 10"})
        this.timerHandle_firstbit = setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(input < 1) {
        this.setState({firstbitErr:"Firstbit must be at least 1฿"})
        this.timerHandle_firstbit = setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else if(input%Math.floor(input) !== 0) {
        this.setState({firstbitErr:"Firstbit must be Integer"})
        this.timerHandle_firstbit = setTimeout(() => this.setState({firstbitErr:null}),10000)
        return false
      } else return true
    }

    regCharacter = pw => {
      let re = /^[ a-zA-Z0-9_ .'"ก-ฮะ-์ -+*%]+$/
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
              fullDesc : this.state.editorValue.toString('html')
        },
        bid:{
            current : parseInt(this.state.firstbit,10),
            maxBid : parseInt((this.state.firstbit - this.state.bidStep),10),
            maxBidTime : parseInt(this.state.timeStart.format('x'),10),
            openBid : parseInt(this.state.firstbit,10),
            bidStep: parseInt(this.state.bidStep,10),
            endTime: parseInt(this.state.timeEnd.format('x'),10),
            startTime: parseInt(this.state.timeStart.format('x'),10),
            count: 0,
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
        own : this.state.User,
        spec:{
          0 : {
            detail : this.state.spec_conditon,
            name : 'Condition',
          },
          1 : {
            detail : this.state.spec_detail1,
            name : this.state.spec_select1 !== 'More...' ? this.state.spec_select1 : this.state.spec_select_add1,
          },
          2 : {
            detail : this.state.spec_detail2,
            name : this.state.spec_select2 !== 'More...' ? this.state.spec_select2 : this.state.spec_select_add2,
          },
          3 : {
            detail : this.state.spec_detail3,
            name : this.state.spec_select3 !== 'More...' ? this.state.spec_select3 : this.state.spec_select_add3,
          },
        }
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
                  spec_detail1:'',
                  spec_detail2:'',
                  spec_detail3:'',
                  spec_select1:'',
                  spec_select2:'',
                  spec_select3:'',
                  spec_conditon:'',
                  timeStart: moment(),
                  timeEnd: moment().add(1, 'days'),
                  boundedTime:'',
                  productnameErr: null,
                  descErr:null,
                  firstbitErr:null,
                  catagoriesErr:null,
                  imageErr:null,
                  timestartErr:null,
                  timeendErr:null,
                  bidstepErr:null,
                  descPicErr:null,
                  specErr:null,
                  conditionErr:null,
                  imageStack:1,
                  editorValue: RichTextEditor.createEmptyValue()
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
              fullDesc : this.state.editorValue.toString('html'),
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

  handleUploadDescError = (error) => {
      this.setState({
        descPicErr: error,
      })
      setTimeout(() => this.setState({descPicErr:null}),10000)
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

  handleUploadSuccess5 = (filename) => {
      this.setState({productimage: filename});
      firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.addPicture(url))
  }

  addPicture = url => {
    let markup = this.state.editorValue.toString('html')
    let picture = '<img src="'+url+'"></img>'
    let index = markup.length - 4
    let newEditorValue = markup.substr(0, index) + picture + markup.substr(index)
    this.setState((prevState, props) => {
      return {editorValue: RichTextEditor.createValueFromString(newEditorValue, 'html')};
    })
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

  increaseImage = e => {
    e.preventDefault()
    this.state.imageStack < 4 &&
    this.setState((prevState) => ({
      imageStack: prevState.imageStack + 1
    }));
  }

  decreaseImage2 = e => {
    e.preventDefault()
    if(this.state.productimageURL3 !== null || this.state.productimageURL4 !== null){
      if(this.state.productimageURL3 !== null && this.state.productimageURL4 !== null){
        this.setState((prevState) => ({
          imageStack: prevState.imageStack - 1,
          productimageURL2: prevState.productimageURL3,
          productimageURL3: prevState.productimageURL4,
          productimageURL4: null,
        }))
      } else {
        if(this.state.productimageURL3 !== null){
          this.setState((prevState) => ({
            imageStack: prevState.imageStack - 1,
            productimageURL2: prevState.productimageURL3,
            productimageURL3: null,
          }))
        }
        if(this.state.productimageURL4 !== null){
          this.setState((prevState) => ({
            imageStack: prevState.imageStack - 1,
            productimageURL2: prevState.productimageURL4,
            productimageURL4: null,
          }))
        }
      }
    } else {
      this.setState((prevState) => ({
        imageStack: prevState.imageStack - 1,
        productimageURL2: null,
      }));
    }
  }

  decreaseImage3 = e => {
    e.preventDefault()
    if(this.state.productimageURL4 !== null){
      this.setState((prevState) => ({
        imageStack: prevState.imageStack - 1,
        productimageURL3: prevState.productimageURL4,
        productimageURL4: null,
      }))
    } else {
      this.setState((prevState) => ({
        imageStack: prevState.imageStack - 1,
        productimageURL3: null,
      }))
    }
  }

  decreaseImage4 = e => {
    e.preventDefault()
    this.setState((prevState) => ({
      imageStack: prevState.imageStack - 1,
      productimageURL4: null,
    }));
  }

  onChange = (editorValue) => {
    this.setState({editorValue})
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
              <p>Add product for selling</p>
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
                    {this.state.desc.length+'/250'}
                    <textarea maxLength="250" type="text" placeholder="Product Description Here" aria-describedby="help-signup" id="" rows="5" required pattern="text"
                    onChange={ this.onNewItemChange } value={ this.state.desc } name="desc" ></textarea>
                  </label>
                  { this.state.descErr &&
										<div className="alert-error">
											<p><i className="fa fa-times"></i> {this.state.descErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                  <label>Product Full Description</label>
                    <RichTextEditor
                      value={this.state.editorValue}
                      onChange={this.onChange}
                      toolbarConfig={this.props.toolbarConfig}
                    />
                    + ADD Photo
                    <ImageUploader
                        name="avatar"
                        storageRef={firebase.storage().ref('images')}
                        onUploadError={this.handleUploadDescError}
                        onUploadSuccess={this.handleUploadSuccess5}
                    />
                  { this.state.descPicErr &&
										<div className="alert-error">
											<p><i className="fa fa-times"></i> {this.state.descPicErr}</p>
										</div>
									}
                </div>
                <div className="small-12 columns">
                    <label>Specification</label>
                      <div className="small-12 columns">
                        <select id="select" required onChange={ this.onNewItemChange } 
                          value={ this.state.spec_conditon} name="spec_conditon">
                          <option value=''>Plese Select Condition</option>
                          {this.props.spec_conditon.map( (condition,i) => {
                              return ( 
                                <option key={i} value={condition}>{condition}</option>
                              );
                            })}
                        </select>
                        { this.state.conditionErr &&
                          <div className="alert-error">
                            <p><i className="fa fa-times"></i> {this.state.conditionErr}</p>
                          </div>
                        }
                      </div>
                      <div className="small-12 columns">
                        <div className="small-6 columns">
                          { this.state.spec_select1 !== 'More...' ?
                            <select id="select" required onChange={ this.onNewItemChange } 
                              value={ this.state.spec_select1} name="spec_select1">
                              <option value=''>Select Specification</option>
                              {this.props.select.map( (select,i) => {
                                  return ( 
                                    <option key={i} value={select}>{select}</option>
                                  )
                                })}
                            </select> :
                            <div style={{position:'relative'}}>
                              <input type="text" placeholder="Specification" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_select_add1 } name="spec_select_add1"/>
                              <i onClick={() => this.setState({spec_select1:''})} style={{position:'absolute',top:'30%',right:'10px',color:'gray'}} className="fa fa-times"></i>
                            </div>    
                          }
                        </div>
                        <div className="small-6 columns">
                          <input type="text" placeholder="Specification Detail" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_detail1 } name="spec_detail1"/>
                        </div>
                        <div className="small-6 columns">
                          { this.state.spec_select2 !== 'More...' ?
                            <select id="select" required onChange={ this.onNewItemChange } 
                              value={this.state.spec_select2} name="spec_select2">
                              <option value=''>Select Specification</option>
                              {this.props.select.map( (select,i) => {
                                  return ( 
                                    <option key={i} value={select}>{select}</option>
                                  );
                                })}
                            </select> :
                            <div style={{position:'relative'}}>
                              <input type="text" placeholder="Specification" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_select_add2 } name="spec_select_add2"/>
                              <i onClick={() => this.setState({spec_select2:''})} style={{position:'absolute',top:'30%',right:'10px',color:'gray'}} className="fa fa-times"></i>
                            </div>      
                          }
                        </div>
                        <div className="small-6 columns">
                          <input type="text" placeholder="Specification Detail" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_detail2 } name="spec_detail2"/>
                        </div>
                        <div className="small-6 columns">
                          { this.state.spec_select3 !== 'More...' ?
                            <select id="select" required onChange={ this.onNewItemChange } 
                              value={ this.state.spec_select3} name="spec_select3">
                              <option value=''>Select Specification</option>
                              {this.props.select.map( (select,i) => {
                                  return ( 
                                    <option key={i} value={select}>{select}</option>
                                  );
                                })}
                            </select> :
                            <div style={{position:'relative'}}>
                              <input type="text" placeholder="Specification" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_select_add3 } name="spec_select_add3"/>
                              <i onClick={() => this.setState({spec_select3:''})} style={{position:'absolute',top:'30%',right:'10px',color:'gray'}} className="fa fa-times"></i>
                            </div>  
                          }
                        </div>
                        <div className="small-6 columns">
                          <input type="text" placeholder="Specification Detail" aria-describedby="help-signup" required pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.spec_detail3 } name="spec_detail3"/>
                        </div>
                      </div>
                      { this.state.specErr &&
                        <div className="alert-error">
                          <p><i className="fa fa-times"></i> {this.state.specErr}</p>
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
                       <input className="input-group-field text-right" type="number" pattern="[0-9]*" onChange={ this.onNewItemChange } value={ this.state.firstbit } name="firstbit"/>
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
                        <input className="input-group-field text-right" type="number" pattern="[0-9]*" onChange={ this.onNewItemChange } value={ this.state.bidStep } name="bidStep"/>
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
                   <label>{'Product Image '+this.state.imageStack+'/4'  }
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
                     {this.state.imageStack > 1 &&
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
                            <button className="admin-from-removeimg" onClick={this.decreaseImage2}><i className="fa fa-times"> </i></button>
                            {this.state.isUploading2  === true ?
                                <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                              : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                            }
                            {this.state.productimageURL2 && 
                              <img src={this.state.productimageURL2} alt="PreviewPic" />
                            }
                        </div>
                      }
                      {this.state.imageStack > 2 &&
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
                            <button className="admin-from-removeimg" onClick={this.decreaseImage3}><i className="fa fa-times"> </i></button>
                            {this.state.isUploading3  === true ?
                                <img className="load-small" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                              : <img className="load-small none" src={require("../../images/Rolling.gif")} alt="PreviewPic" />
                            }
                            {this.state.productimageURL3 && 
                              <img src={this.state.productimageURL3} alt="PreviewPic" />
                            }
                        </div>
                      }
                      {this.state.imageStack > 3 &&
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
                            <button className="admin-from-removeimg" onClick={this.decreaseImage4}><i className="fa fa-times"> </i></button>
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
                    {this.state.imageStack < 4 &&
                    <button className="admin-from-addimg" onClick={this.increaseImage}><i className="fa fa-plus"> </i> Add More Photo</button>
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
        </div>
    );
  }
}


export default Edit 

Edit.defaultProps = {
  toolbarConfig : {
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
      {label: 'Italic', style: 'ITALIC'},
      {label: 'Underline', style: 'UNDERLINE'},
      {label: 'Strikethrough', style: 'STRIKETHROUGH'},
    ],
    BLOCK_TYPE_DROPDOWN: [
      {label: 'Normal', style: 'unstyled'},
      {label: 'Heading Large', style: 'header-one'},
      {label: 'Heading Medium', style: 'header-two'},
      {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
      {label: 'UL', style: 'unordered-list-item'},
      {label: 'OL', style: 'ordered-list-item'},
      {label: "Blockquote", style: "blockquote"}
    ]
  },
  spec_conditon:[
    'New',
    'Used',
    'Manufacturer refurbished',
  ],
  select: [
    'Brand',
    'Color',
    'Height',
    'Weight',
    'More...',
  ]
}