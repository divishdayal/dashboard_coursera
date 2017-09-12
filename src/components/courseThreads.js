import React from 'react';
import Navbar from './navbar';
import axios from 'axios';
import ThreadList from './threadList';
import { Link } from 'react-router-dom';
import Loading from './loading';
import Pagination from './pagination';
import {Tab, Tabs} from 'react-toolbox';

//This component lists the Threads for the Course Page
export default class CourseThreads extends React.Component {
	constructor(props) {
    super(props);
    //threads contains all threads
    //courseInfo contains the fields of the course
    //isLoading is to render the loading page when website is loading
    //index is the index of the current tab [0, 1, 2]
    //all_threads is the unchanged list of threads. threads argument is changed according to the 
    //tab value.
    this.state = { threads : [], courseInfo:{}, isLoading:true, index: 0, all_threads: []};
    this.handleTabChange = this.handleTabChange.bind(this);
  	}
  	//Get the list of Course Thread information from the server - using Axios library
  	componentWillMount(){
  		var params_id = this.props.match.params.id;
  		axios.get('http://localhost:8080/api/' + params_id)
      		.then(response => {this.setState({threads : response.data}); console.log(response.data)  })
      		.then(() => this.setState({all_threads : this.state.threads}));
      	axios.get('http://localhost:8080/courses.json')
      		.then(response => this.setState({courseInfo : response.data.filter(function(data){ return data.id == params_id })[0]}));
      	
  	};

  	//After Mounting the Component - render the page removing the 'Loading' page
  	componentDidMount(){
  		this.setState({isLoading : false});
  	};

  	//for change of tabs for thread ordering/filtering
  	handleTabChange(index_num){
	    this.setState({index : index_num});
	    switch(index_num){
	    	//--------------top-------
	    	case 0:
	    	this.setState({threads : this.state.all_threads.sort((a, b) => {return b.score - a.score})}); 
	    		console.log(this.state.threads);
	    	break;

	    	//--------------latest-------
	    	case 1:

	    		this.setState({threads : this.state.all_threads.sort((a, b) => {return (b.lastAnsweredAt > b.createdAt ? b.lastAnsweredAt : b.createdAt) - (a.lastAnsweredAt > a.createdAt ? a.lastAnsweredAt : a.createdAt)})}); 
	    		console.log(this.state.threads);
	    	break;

	    	//--------------unanswered-------
	    	case 2:
	    		var threads = this.state.threads;
	    		
	    		var last_answered_only = threads.filter(function (entry) {
				    return (entry.totalAnswerCount == 0);
				});
	    		this.setState({threads : last_answered_only.sort((a, b) => {return (b.lastAnsweredAt > b.createdAt ? b.lastAnsweredAt : b.createdAt) - (a.lastAnsweredAt > a.createdAt ? a.lastAnsweredAt : a.createdAt)})}); 
	    	break;
	    }
	  };

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
				    	<Tabs className = 'tabs' index={this.state.index} onChange={this.handleTabChange}>
				          <Tab label='Top'></Tab>
				          <Tab label='Latest' onActive={this.handleActive}></Tab>
				          <Tab label='Unanswered'></Tab>
				        </Tabs>
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