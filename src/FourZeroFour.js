import React from "react";

export default class Projects extends React.Component {
  componentDidMount() {
    this.props.triggler()
  }
	render() {
		return (
			<div className="page missed">
				<h1> 404 </h1>
			</div>
		);
	}
}
