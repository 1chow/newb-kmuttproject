import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../components/Animated_switch"


import Navigator from "../components/wrapper/top_bar"
import Categories from '../components/Categories'
import SellingArea from "../components/SellingArea"
import ProjectItem from "../components/Project_item"
import FourZeroFour from "../components/FourZeroFour"
import Modals from '../components/Main_modal'

window.Perf = Perf;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			showModal: false,
			isActive: 'LE',
			typeModal: 'checkout',
		};
	}
	componentDidMount() {
		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getItem")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					projects: json.slice(0, 8)
				});
			});
	}

	handleOpenModal = type => {
		this.setState({ showModal: true });
		this.setState({ typeModal: type });
		document.body.style.overflow = "hidden"
	}
	handleCloseModal = () => {
		this.setState({ showModal: false });
		this.setState({ typeModal: 'checkout' });
		document.body.style.overflow = null
	}
	filter = type => {
		this.setState({ isActive: type });
	}
	render() {
		return (
			<div>
			<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
				{/* Navigator Bar */}
				<Navigator triggler={this.handleOpenModal} />
				<Categories isActive={this.state.isActive} filter={this.filter} />
				
				{/* Application Routes Zone */}
					<div className="row">
						<Route
						render ={ ({ location }) => (

							<TransitionGroup>
								<AnimatedSwitch
									key={location.key}
									location={location}
								>
									<Route
										exact
										path="/"
										render={props => (
											<SellingArea projects={this.state.projects} />
										)}
									/>
									<Route
										path="/item/:itemid"
										render={props => (
											<ProjectItem projects={this.state.projects} />
										)}
									/>
									<Route 
										render={() => (
											<FourZeroFour/>
									)} />
								</AnimatedSwitch>
							</TransitionGroup>

						) }/>
					</div>
				
			</section>
			<Modals close={this.handleCloseModal} isOpen={this.state.showModal} projects={this.state.projects} type={this.state.typeModal}/>
			</div>

		);
	}
}