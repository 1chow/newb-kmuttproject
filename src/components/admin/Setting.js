import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'


export default class Setting extends Component {
  constructor () {
    super();
    this.state = {
      username:'',
      email:'',
			Uid:'',
			userimage:'',
      userimageURL:'',
      Error: null ,
      setting: false,
      address: '',
    }
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;
    if (user) {
    	this.setState({email: user.email,Uid: user.uid})
    	firebase.database().ref('/users/' + user.uid + '/info').once('value', dataSnapshot => {
	      var userdata = dataSnapshot.val();
	      this.setState({username: userdata.displayName , address: userdata.address})
	    })
	}
  }

  componentWillReceiveProps(nextProps) {
  	let user = firebase.auth().currentUser;
  	 if (user) {
    	this.setState({email: user.email,Uid: user.uid})
    	firebase.database().ref('/users/' + user.uid + '/info').once('value', dataSnapshot => {
	      var userdata = dataSnapshot.val();
	      this.setState({username: userdata.displayName , address: userdata.address})
	    })
	}
	
  }

  onNewItemChange = (e) => {
  	e.preventDefault
    this.setState({ [e.target.name]: e.target.value })
  }

  Setting = (e) => {
  	e.preventDefault
    this.setState({ setting: !this.state.setting})
	}
	
	handleUploadError = (error) => {
      this.setState({isUploading: false})
      console.error(error)
  }
  handleUploadSuccess = (filename) => {
      this.setState({userimage: filename, progress: 100, isUploading: false});
			firebase.storage().ref('images').child(filename).getDownloadURL()
				.then(url => { 
					this.setState({userimageURL: url})
					firebase.database().ref().child(`users/${this.state.Uid}/info`)
					.update({
							photoUrl: url
					})
			})
	}
		
	handleNewItemSubmit = (e) => {
    e.preventDefault();
    this.setState({registerError: null })
      if (this.state.username && this.state.username.trim().length !== 0) {
					if (this.state.email && this.state.email.trim().length !== 0){
							if (this.state.address && this.state.address.trim().length !== 0){
							firebase.database().ref().child(`users/${this.state.Uid}/info`)
							.update({
									displayName: this.state.username,
									email: this.state.email,
									address: this.state.address
							})} else this.setState({Error: 'Please enter a valid address' })
					} else this.setState({Error: 'Please enter a valid email' })
      } else this.setState({Error: 'Please enter a valid username' })
    this.setState({ 
			username:'',
      email:'',
			Uid:'',
			userimage:'',
      userimageURL:'',  })
	}
	
	componentWillUnmount() {
		this.setState({registerError: null })
	}

  render(){
    return (
	          <div className="row">
	            <div className="small-12 columns user-container">
	              <h1> Your Profile</h1>
	              <p>Detail of You</p>
	              <button className="user-edit" onClick={this.Setting}><i className={"fa fa-pencil-square-o " +  (this.state.setting === true && "active") }></i></button>
	              <div className="hr-text-center"><hr/></div>
	          	</div>
	          	<div className="small-12 large-4 columns img-uploader">
                   <label>Profile Image
                    <div className="box-img user-box-img">
                        <label className="button btn-file ">
                        + Edit Photo
                        <ImageUploader
                                name="avatar"
                                storageRef={firebase.storage().ref('images')}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={this.handleUploadSuccess}
                                onProgress={this.handleProgress}
                        />
                        </label>
                        <img className="user-profile" src={this.props.profilePicture} alt=""></img>
                     </div>
                    </label>
			    </div>
			    <div className="small-12 large-8 columns">
	          	<form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
	             <div className="small-12 columns">
	                <div className="small-12 columns">
	                  <label>User Name
	                  { this.state.setting === true ?
	                    <input type="text" placeholder="User Name" pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.username } name="username"/>
	                    :<p className='user-p'>{ this.state.username }</p>
	                   }
	                  </label>
    	     		</div>
    	     		<div className="small-12 columns">
	                  <label>E-mail
	                    { this.state.setting === true ?
	                    <input type="email" placeholder="E-mail" pattern="email" id="email" onChange={ this.onNewItemChange } value={ this.state.email } name="email"/>
	                    :<p className='user-p'>{ this.state.email } </p>
	                   }
	                  </label>
    	     		</div>
	     			<div className="small-12 columns">
	                  <label>Address
	                    { this.state.setting === true ?
	                    	this.state.address ?
	                    <textarea className="checkout-address" name="address" rows="5" autoCorrect="off" spellCheck="false" onChange={this.onNewItemChange} value={this.state.address} ></textarea> : <textarea className="checkout-address" name="address" rows="10" autoCorrect="off" spellCheck="false" onChange={this.onNewItemChange} value=" Please provide a contact address. And shipping" ></textarea>
	                    : this.state.address ? <textarea name="address" className="checkout-address"rows="5" autoCorrect="off"  readOnly defaultValue={this.state.address}></textarea> :
	                    	<textarea name="address" className="checkout-address"rows="5" autoCorrect="off"  readOnly defaultValue=" Please provide a contact address. And shipping"></textarea>
	                   }
	                  </label>
    	     		</div>
	     		 </div>
						{ this.state.setting === true &&
						<button type='submit'>Submit</button>
						}
	            </form>
	            </div>
	          </div>
    )
  }

}