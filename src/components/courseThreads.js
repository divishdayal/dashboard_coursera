import React from 'react';
import Navbar from './navbar';
import axios from 'axios';
import ThreadList from './threadList';
import { Link } from 'react-router-dom';
import Loading from './loading';
import Pagination from './pagination';

//This component lists the Threads for the Course Page
export default class CourseThreads extends React.Component {
	constructor(props) {
    super(props);

    this.state = { threads : [], courseInfo:{}, isLoading:true}
  	}

  	//Get the list of Course Thread information from the server - using Axios library
  	componentWillMount(){
  		var params_id = this.props.match.params.id;
  		axios.get('http://localhost:8080/api/' + params_id)
      		.then(response => this.setState({threads : response.data}) );
      	axios.get('http://localhost:8080/courses.json')
      		.then(response => this.setState({courseInfo : response.data.filter(function(data){ return data.id == params_id })[0]}));
  	}

  	//After Mounting the Component - render the page removing the 'Loading' page
  	componentDidMount(){
  		this.setState({isLoading : false});
  	}
	render() {
		return ( this.state.isLoading ? <Loading/> : 
			<div>
				<Navbar />
				<div className="row">
					<div className="link_icon col s3">
						<Link className='link_back' to='/'><i className="material-icons medium icon">arrow_back</i></Link>
				    </div>
				    <div className="courseThreads col s6">
				    	<h4> Course Threads <i className="material-icons">chevron_right</i> {this.state.courseInfo.name == null ? 'Error - 404' : this.state.courseInfo.name} </h4>

				    	<div className = "threadList">
	          				<ThreadList threads = {this.state.threads.slice((this.props.match.params.num-1)*10,this.state.threads.length > this.props.match.params.num*10 ? this.props.match.params.num*10: this.state.threads.length)} linkName={this.state.courseInfo.linkName} />
	        			</div>
	        			<div className = 'pagination_component'>
	        			  <ul className="pagination">
	        			  	<Pagination numberOfPages={Math.ceil(this.state.threads.length/10)} courseId={this.props.match.params.id} currentPage={this.props.match.params.num}/> 
						  </ul>
						</div>
				    </div>
				</div>

		    </div>
		);
	}
}