import React, { Component } from 'react'
import firebase from 'firebase';

class ImageAndProgress  extends Component {
    state = {
        url: ''
    };
 
    componentDidMount() {
        firebase.storage().ref('image').child(this.props.filename).getDownloadURL.then(url => this.setState({url}));
    }
 
    componentWillReceiveProps(next) {
        if (next.filename !== this.props.filename) {
            firebase.storage().ref('image').child(next.filename).getDownloadURL.then(url => this.setState({url}));
        }
    }
    render() {
        return (
             <div>
                 + ADD Photo
                {this.props.isUploading && <p>Progress: {this.props.progress}</p>}
                {this.state.url && <img src={this.state.url} />}
            </div>
        )
    }
}

export default ImageAndProgress 
