import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import ReactModal from 'react-modal'
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "./animated_switch"

import Navigator from "./wrapper/top_bar"
import Categories from './categories'
import Projects from "./projects"
import ProjectItem from "./project_item"
import FourZeroFour from "./FourZeroFour"
import Plays from './plays'

window.Perf = Perf;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			showModal: false
		};
	}
	componentDidMount() {
		fetch("https://jsonplaceholder.typicode.com/posts")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					projects: json.slice(0, 8)
				});
			});
	}
	handleOpenModal = () => {
    	this.setState({ showModal: true });
		document.body.style.overflow = "hidden"
	}
	handleCloseModal = () => {
    	this.setState({ showModal: false });
		document.body.style.overflow = null
	}
	render() {
		return (
			<section className="warpper">
				{/* Navigator Bar */}
				<Navigator Ismodal={this.state.showModal} />
				<Categories />

				{/* Modal Zone */}
				<ReactModal 
					isOpen={this.state.showModal}
					contentLabel="?"
					style={this.props.customStyles}
					>
					<button onClick={this.handleCloseModal}>Close Modal</button>
					<Plays />
				</ReactModal>

				{/* Application Routes Zone */}
				<div className="row relative">
				<Route
					render={({ location }) => (
						<TransitionGroup>
							<AnimatedSwitch
								key={location.key}
								location={location}
							>
								<Route
									exact
									path="/"
									render={props => (
										<Projects {...props} projects={this.state.projects} />
									)}
								/>
								<Route
									path="/projects/:id"
									render={props => (
										<ProjectItem {...props} projects={this.state.projects} />
									)}
								/>
								<Route
									path="/plays"
									render={props => (
										<Plays {...props} projects={this.state.projects} />
									)}
								/>
								<Route 
									render={() => (
										<FourZeroFour triggler={this.handleOpenModal} />
								)} />
							</AnimatedSwitch>
						</TransitionGroup>
					)}
				/>
				</div>
			</section>
		);
	}
}

App.defaultProps = {
	customStyles: {
		overlay : {
			position          : 'fixed',
			top               : 0,
			left              : 0,
			right             : 0,
			bottom            : 0,
			backgroundColor   : 'rgba(255, 255, 255, 0.75)',
		},
		content : {
			position                   : 'absolute',
			top                        : '40px',
			left                       : '40px',
			right                      : '40px',
			bottom                     : '40px',
			border                     : '1px solid #ccc',
			background                 : '#fff',
			overflow                   : 'hidden',
			WebkitOverflowScrolling    : 'touch',
			borderRadius               : '4px',
			outline                    : 'none',
			padding                    : '20px'
		}
	}
}