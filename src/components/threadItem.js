import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

//helper for showing the text on Thread badges
const processBadge = (str) => {
	switch(str){
		case 'STAFF_RESPONDED':
			return 'Staff Replied';
			break;
		case 'STAFF_CREATED':
			return 'Staff Created';
			break;
		case 'INSTRUCTOR_CREATED':
			return 'Instructor Created';
			break;
		default:
			return '';
	}
}

//helper for rendering the Thread Badges
const threadBadge = (props) => {
	if(props.thread.answerBadge != '')
		return (<span className= 'threadBadge chip'>
				{processBadge(props.thread.answerBadge)}
			</span>);
}

//Component for each of the thread items in the list of the Course Threads
const ThreadItem = (props) => {
	var now_time = moment(new Date());
	var link_href = 'https://www.coursera.org/learn/' + props.linkName + '/discussions/all/threads/' + props.thread.threadId
	return(
		<a href={link_href} target="_blank" className='threadLink'>
		<div className = 'threadItem grey lighten-4 row'>
			<span className = 'threadTitle col s10 truncate'>
				{ props.thread.title }
			</span>
			<span className= 'threadViews col s1'>
				<b>{props.thread.viewCount}</b> <br/>views
			</span>
			<span className= 'threadViews col s1'>
				<b>{props.thread.totalAnswerCount}</b> <br/> replies
			</span>
			<br />
			<div className='col s12'>
				{threadBadge(props)}
				<span className = 'threadBy'>
					{moment(props.thread.lastAnsweredAt).isValid() ? 
						'Last posted ' : 'Created '}
				</span>
				<span className = 'threadBy'>
					{moment(props.thread.lastAnsweredAt).isValid() ? 
						moment.duration(now_time.diff(moment(props.thread.lastAnsweredAt))).humanize() :
						moment.duration(now_time.diff(moment(props.thread.createdAt))).humanize()
					} ago
				</span>
			</div>
		</div>
		</a>
	);
}

export default ThreadItem;