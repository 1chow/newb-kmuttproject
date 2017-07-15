import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import ReactModal from 'react-modal'
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "./Animated_switch"

import Navigator from "./wrapper/top_bar"
import Categories from './Categories'
import SellingArea from "./SellingArea"
import ProjectItem from "./Project_item"
import FourZeroFour from "./FourZeroFour"
import Modal from './Main_modal'

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
				<Navigator triggler={this.handleOpenModal} />
				<Categories />

				{/* Modal Zone */}
				
				<ReactModal 
					isOpen={this.state.showModal}
					contentLabel="?"
					className="ReactModal__Content"
					overlayClassName="ReactModal__Overlay"
					>
					<Modal close={this.handleCloseModal} />
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
										<SellingArea {...props} projects={this.state.projects} />
									)}
								/>
								<Route
									path="/item/:itemid"
									render={props => (
										<ProjectItem {...props} projects={this.state.projects} />
									)}
								/>
								<Route 
									render={() => (
										<FourZeroFour/>
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