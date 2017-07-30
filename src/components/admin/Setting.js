import React, { Component } from 'react'
import * as firebase from 'firebase'

export default class Setting extends Component {
  constructor () {
    super();
    this.state = {
      username:'',
      email:'',
      Uid:'',
      Error: null ,
      setting: false,
      address: ''
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

  render(){
    return this.state.address ? (
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
                        {this.state.isUploading &&
                            <p>{this.state.progress}%</p>
                        }
                        {this.state.avatarURL &&
                            <img src={this.state.avatarURL} alt="PreviewPic" />
                        }
                        <label className="button btn-file ">
                        + Edit Photo
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
                        <img className="user-profile" src="https://graph.facebook.com/100000028820064/picture?width=300&height=300" alt=""></img>
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
	                    	this.state.address &&
	                    <textarea className="checkout-address" name="" id="" rows="5" autocorrect="off" spellcheck="false" defaultValue={ this.state.address } ></textarea>
	                    : this.state.address && <textarea className="checkout-address" name="" id="" rows="5" autocorrect="off"  readOnly defaultValue={ this.state.address }></textarea>
	                   }
	                  </label>
    	     		</div>
	     		 </div>
	            </form>
	            </div>
	          </div>
    ) : null
  }

}