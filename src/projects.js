import React, { Component } from "react";
import { Link } from "react-router-dom";
import TransitionGroup from "react-transition-group/TransitionGroup";
import * as Animated from "animated/lib/targets/react-dom";

export default class Projects extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			animations: []
		};
	}
	//For After First Render
	componentDidMount() {
		this._renderProjects(this.props.projects);
	}
	//For First Render
	componentWillReceiveProps(nextProps) {
		if (!this.props.projects.length && nextProps.projects.length) {
			this._renderProjects(nextProps.projects);
		}
	}

	// Animation Logic
	_renderProjects(projects) {
		this.setState(
			{
				projects: projects,
				animations: projects.map((_, i) => new Animated.Value(0))
			},
			() => {
				Animated.stagger(
					100,
					this.state.animations.map(anim =>
						Animated.spring(anim, { toValue: 1 })
					)
				).start();
			}
		);
	}
	render() {
		return (
			<div className="page projects">
				<TransitionGroup>
					{this.state.projects.map((p, i) => {
						const style = {
							opacity: this.state.animations[i],
							transform: Animated.template`
								translate3d(0,${this.state.animations[i].interpolate({
								inputRange: [0, 1],
								outputRange: ["12px", "0px"]
							})},0)
							`
						};
						return (
							<div key={i} className="small-6 medium-4 large-3 columns post-box">
							   <Animated.div style={style}>
									<Link to='/projects/1'>
										<div className="post-box-top">
											<img src="http://dummyimage.com/300x300/292929/e3e3e3&text=Your Mom Goes to College" alt=""/>
										</div>
										<div className="post-box-content">
											<h3>SaltyCamel</h3>
											<p className="desc">Sweety</p>
											<span className="timecount red">00:00:00</span>
											<p className="price">999<span className="curentcy">Bath</span></p>
											<button><i className="fa fa2x "></i></button>
										</div>
									</Link>
								</Animated.div>
							</div>
						);
					})}
				</TransitionGroup>
			</div>
		);
	}
}
