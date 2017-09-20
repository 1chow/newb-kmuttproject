import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'


export default class Setting extends Component {
  constructor () {
    super();
    this.state = {
			newusername:'',
			username:'',
			newemail:'',
      email:'',
			Uid:'',
			userimage:'',
      userimageURL:'',
      Error: null ,
			setting: false,
			newaddress:'',
      address: '',
    }
  }

  componentDidMount() {
		let user = firebase.auth().currentUser;
		if (user) {
			this.setState({email: user.email,Uid: user.uid})
			firebase.database().ref('/users/' + user.uid + '/info').once('value', dataSnapshot => {
				var userdata = dataSnapshot.val();
				this.setState({
					username: userdata.displayName,
					newusername: userdata.displayName,
					address: userdata.address
				})
			})
		}
	}
	
	validateEmail = (email) =>
	{
			var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
			return re.test(email);
	}


  onNewItemChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  Setting = (e) => {
		this.setState({ 
			newusername: this.state.username,
			newemail:this.state.email,
			newaddress:this.state.address,
			setting: !this.state.setting,
			Error: null,
		})
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
      if (this.state.newusername && this.state.newusername.trim().length !== 0 && this.state.newusername.trim().length <= 10) {
					if (this.state.newemail && this.state.newemail.trim().length !== 0 && this.validateEmail(this.state.newemail.trim()) === true){
							if (this.state.newaddress && this.state.newaddress.trim().length !== 0 && this.state.newaddress.trim().length <= 30){
							this.setState({
								Error: null,
								username: this.state.newusername,
								email:this.state.newemail,
								address:this.state.newaddress,
							 })
							firebase.database().ref().child(`users/${this.state.Uid}/info`)
							.update({
									displayName: this.state.newusername,
									email: this.state.newemail,
									address: this.state.newaddress
							})
							this.props.triggler('alert','good','Your detail has changes','fa-check-circle')
							} else this.setState({Error: 'Please enter a valid address' })
					} else this.setState({Error: 'Please enter a valid email' })
      } else this.setState({Error: 'Please enter a valid username' })
    this.setState({ setting: !this.state.setting})
	}
	
	componentWillUnmount() {
		this.setState({Error: null })
	}

  render(){
    return this.state ? (
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
						   { this.state.Error &&
                  <div className="small-12 columns">
                    <div className="alert callout">
                      <p><i className="fi-alert"></i>{this.state.Error}</p>
                    </div>
                  </div>
                }
	          	<form data-abide noValidate onSubmit={ this.handleNewItemSubmit } >
	             <div className="small-12 columns">
	                <div className="small-12 columns">
	                  <label>User Name
	                  { this.state.setting === true ?
	                    <input type="text" placeholder="User Name" pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.newusername } name="newusername"/>
	                    :<p className='user-p'>{ this.state.username }</p>
	                   }
	                  </label>
    	     		</div>
    	     		<div className="small-12 columns">
	                  <label>E-mail
	                    { this.state.setting === true ?
	                    <input type="email" placeholder="E-mail" pattern="email" id="email" onChange={ this.onNewItemChange } value={ this.state.newemail } name="newemail"/>
	                    :<p className='user-p'>{ this.state.email } </p>
	                   }
	                  </label>
    	     		</div>
	     			<div className="small-12 columns">
	                  <label>Address
	                    { this.state.setting === true ?
	                    	this.state.address &&
	                    <textarea className="checkout-address-active" name="newaddress" rows="5" autoCorrect="off" spellCheck="false" onChange={this.onNewItemChange} value={this.state.newaddress} ></textarea>
	                    : this.state.address && <textarea name="address" className="checkout-address"rows="5" autoCorrect="off"  readOnly value={this.state.address}></textarea>
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
    ) : null
  }

}