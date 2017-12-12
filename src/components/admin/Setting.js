import React, { Component } from 'react'
import * as firebase from 'firebase'
import ImageUploader from 'react-firebase-image-uploader'


export default class Setting extends Component {
  constructor () {
    super();
    this.state = {
			username:'',
			address: '',
			email:'',
			newusername:'',
			newaddress:'',
			Uid:'',
			userimage:'',
     	    userimageURL:'',
			usernameErr: null,
			addressErr: null,
			setting: false,
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

	regCharacter = pw => {
		let re = /^[-_a-zA-Z0-9.]+$/
		return re.test(pw);
	}


  onNewItemChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  Setting = (e) => {
		this.setState({ 
			newusername: this.state.username,
			newaddress:this.state.address,
			setting: !this.state.setting,
			usernameErr: null,
			addressErr: null,
		})
	}
	
	handleUploadError = (error) => {
      this.setState({isUploading: false})
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
		this.setState({
			usernameErr: null,
			addressErr: null,
		})
		let test_username = this.userValidate(this.state.newusername)
		let test_newaddress = this.addressValidate(this.state.newaddress)
		let isValid = test_username && test_newaddress
		if(isValid === true){
			if (window.confirm("Do you want to update your profile?") === true) {
				this.updateProfile()
			} else {
				this.setState({
					newusername: this.state.username,
					newaddress:this.state.address,
				})
			}
		}
	}

	updateProfile = () => {
		this.setState({
			username: this.state.newusername.slice(0,40),
			address:this.state.newaddress.slice(0,200),
			})
		firebase.database().ref().child(`users/${this.state.Uid}/info`)
		.update({
				displayName: this.state.newusername.slice(0,40),
				address: this.state.newaddress.slice(0,200)
		})
		this.props.triggler('alert','good','Your detail has changes','fa-check-circle')
		this.setState({ setting: !this.state.setting})
	}

	userValidate = input => {
		if(input.trim().length === 0){
			this.setState({usernameErr:"Username was empty"})
			this.timerHandle_username = setTimeout(() => this.setState({usernameErr:null}),5000)
			return false
		} else if(input.trim().length >= 50) {
			this.setState({usernameErr:"Maximum username was 50 characters"})
			this.timerHandle_username = setTimeout(() => this.setState({usernameErr:null}),5000)
			return false
		} else if(this.regCharacter(input.trim()) === false) {
			this.setState({usernameErr:"Username must be Character"})
			this.timerHandle_username = setTimeout(() => this.setState({usernameErr:null}),5000)
			return false
		} else return true
	}

	addressValidate = input => {
		if(input.trim().length === 0){
			this.setState({addressErr:"Address was empty"})
			this.timerHandle_address = setTimeout(() => this.setState({addressErr:null}),5000)
			return false
		} else if(input.trim().length >= 400) {
			this.setState({addressErr:"Maximum address was 400 characters"})
			this.timerHandle_address = setTimeout(() => this.setState({addressErr:null}),5000)
			return false
		} else return true
	}

	componentWillUnmount() {
		if (this.timerHandle_username) {               
			clearTimeout(this.timerHandle_username);     
			this.timerHandle_username = 0;                
		}
		if (this.timerHandle_address) {               
			clearTimeout(this.timerHandle_address);     
			this.timerHandle_address = 0;                
		}
	}

  render(){
    return this.state ? (
	          <div className="row">
	            <div className="small-12 columns user-container">
	              <h1> Your Profile</h1>
	              <p>Detail of You</p>
				  {
					this.state.setting !== true ?
					<button className="user-edit" onClick={this.Setting}><i className={"fa fa-pencil-square-o " +  (this.state.setting === true && "active") }></i></button>
					:
					<button className="user-edit" onClick={this.Setting}><i className={"fa fa-close " +  (this.state.setting === true && "active") }></i></button>
				  }
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
	                    <input type="text" placeholder="User Name" pattern="text" id="p_name" onChange={ this.onNewItemChange } value={ this.state.newusername } name="newusername"/>
	                    :<p className='user-p'>{ this.state.username }</p>
	                   }
	                  </label>
							{ this.state.usernameErr &&
								<div className="alert-error">
									<p><i className="fa fa-times"></i> {this.state.usernameErr}</p>
								</div>
							}
    	     		</div>
    	     		<div className="small-12 columns">
	                  <label>E-mail
	                    <p className='user-p'>{ this.state.email } </p>
	                  </label>
    	     		</div>
	     			<div className="small-12 columns">
	                  <label>Address
	                    { this.state.setting === true ?
	                    	this.state.address && 
							this.state.address.trim().length === 0 ? 
							<p className='user-p'> Pls fill your address </p>
							:
							<textarea className="checkout-address-active" name="newaddress" rows="4" autoCorrect="off" spellCheck="false" onChange={this.onNewItemChange} value={this.state.newaddress} ></textarea>
							: 
							this.state.address && 
							<p className='user-p'>{ this.state.address } </p>
	                   }
	                  </label>
							{ this.state.addressErr &&
								<div className="alert-error">
									<p><i className="fa fa-times"></i> {this.state.addressErr}</p>
								</div>
							}
    	     		</div>
	     		 
						{ this.state.setting === true &&
						<div className="small-6 columns admin-from-btm">
							<button className="button success" type='submit'>Submit</button>
						</div>
						}
					</div>
	            </form>
	            </div>
	          </div>
    ) : null
  }

}