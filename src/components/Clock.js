import React from "react"
import Loading from "./Loading"

class Clock extends React.Component {
  state = {
    hotTime: false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.timeNows.timeNow <= 15){
      this.setState({hotTime: true})
    }  else this.setState({hotTime: false})
  }

  render() {
    return  (
      <span className={"timecount " + (this.state.hotTime ? 'red' : 'green')}>
          <ul className="post-box-time">
            <li>{this.props.secondsToHms(this.props.timeNows.timeNow,'day')}<span className="info">day</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNows.timeNow,'hr')}<span className="info">hr</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNows.timeNow,'min')}<span className="info">min</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNows.timeNow,'sec')}<span className="info">sec</span></li>
          </ul>
      </span>
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
      <span className={"timecount " + (this.state.hotTime ? 'red' : 'green')}>
          <ul className="post-box-time">
            <li>{this.props.secondsToHms(this.props.timeNow,'day')}<span className="info">day</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNow,'hr')}<span className="info">hr</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNow,'min')}<span className="info">min</span></li>
            <li className="next">:</li>
            <li>{this.props.secondsToHms(this.props.timeNow,'sec')}<span className="info">sec</span></li>
          </ul>
      </span>
    )
  }
}

export default function Clocks(props) {
  return props.timeNows ? (
      <Clock secondsToHms={props.secondsToHms} timeNows={props.timeNows} />
  ) : props.timeNow ? (
      <Clock2 secondsToHms={props.secondsToHms} timeNow={props.timeNow} />
  ) : <Loading />
}


