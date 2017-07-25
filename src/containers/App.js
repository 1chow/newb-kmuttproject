import React, { Component } from "react"
import Perf from 'react-addons-perf'
import { Route } from "react-router-dom"
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../components/animate/MainAnimated"


import Navigator from "../components/wrapper/Navigator"
import Categories from '../components/Categories'
import SellingArea from "../components/SellingArea"
import Item from "../components/Item"
import FourZeroFour from "../components/FourZeroFour"
import Modals from '../components/Mainmodal'

window.Perf = Perf;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			showModal: false,
			isActive: 'LE',
			typeModal: 'checkout',
			isLogin: false,
		};
	}
	componentDidMount() {
		fetch("https://us-central1-auctkmutt.cloudfunctions.net/getItems")
			.then(response => {
				return response.json();
			})
			.then(json => {
				this.setState({
					projects: json.slice(0, 8)
				});
			});
	}

	//Modal Logic
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
	changeType = type => {
		this.setState({ typeModal: type });
	}

	//Authentucate Logic
	authentication = () =>{
		//Autenticate Logic Here
		this.setState({ isLogin: true });
		this.handleCloseModal()
	}
	logout = () =>{
		this.setState({ isLogin: false });
	}


	render() {
		return (
			<div>
			<section className={"warpper " + (this.state.showModal === true  && 'blur-for-modal')}>
				{/* Navigator Bar */}
				<Navigator triggler={this.handleOpenModal} isLogin={this.state.isLogin} logout={this.logout} />
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
											<Item projects={this.state.projects} />
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
			<Modals 
				close={this.handleCloseModal} 
				isOpen={this.state.showModal} 
				projects={this.state.projects} 
				type={this.state.typeModal}
				authentication={this.authentication}
				changeType={this.changeType}
			/>
			</div>

		);
	}
}