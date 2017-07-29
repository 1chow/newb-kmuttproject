import React from "react"
import Loading from "./Loading"

class Clock extends React.Component {
  state = {
    currentCount: (this.props.item.bid.endTime - this.props.item.timeNow)/1000,
    hotTime: true
  }

  componentDidMount() {
      let intervalId = setInterval(this.timer, 1000)
      this.setState({intervalId: intervalId})
  }

  componentWillUnmount(){
    clearInterval(this.state.intervalId)
  }

  timer = () => {
    let newCount = this.state.currentCount - 1;
    if(newCount >= 0) { 
        this.setState({ currentCount: newCount })
        if(newCount <= 16) {this.setState({ hotTime: false })}
    } else {
        this.setState({ currentCount: 0 })
        this.setState({ hotTime: false })
        clearInterval(this.state.intervalId)
    }
  }

  render() {
    let test = new Date(this.state.currentCount * 1e3).toISOString().slice(-13, -5);
    return  test ? (
      <span className={"timecount " + (this.state.hotTime ? 'green' : 'red')}>{test}</span>
    ) : null
  }
}

export default  function Clocks(props) {
  return props.item ? (
      <Clock item={props.item} />
  ) : <Loading />
}


