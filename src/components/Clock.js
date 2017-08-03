import React from "react"
import Loading from "./Loading"

class Clock extends React.Component {
  state = {
    hotTime: false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.timeNows.timeNow <= 15){
      this.setState({hotTime: true})
    } 
  }

  render() {
    return  (
      <span className={"timecount " + (this.state.hotTime ? 'red' : 'green')}>{this.props.secondsToHms(this.props.timeNows.timeNow)}</span>
    )
  }
}

class Clock2 extends React.Component {
  state = {
    hotTime: false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.timeNow <= 15){
      this.setState({hotTime: true})
    } else this.setState({hotTime: false})
  }

  render() {
    return  (
      <span className={"timecount " + (this.state.hotTime ? 'red' : 'green')}>{this.props.secondsToHms(this.props.timeNow)}</span>
    )
  }
}

export default  function Clocks(props) {
  return props.timeNows ? (
      <Clock secondsToHms={props.secondsToHms} timeNows={props.timeNows} />
  ) : props.timeNow ? (
      <Clock2 secondsToHms={props.secondsToHms} timeNow={props.timeNow} />
  ) : <Loading />
}


