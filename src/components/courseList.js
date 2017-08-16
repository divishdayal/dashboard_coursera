import React from 'react';
import CourseItem from './courseItem';

//CourseList component is to render the list of Components using the CourseItem Component
//on the home page
const CourseList = (props) => {
	const courses = props.courses.map(course => {
		return(
			<div className = "courseListItem">
				<CourseItem key = {course.id} id={course.id} courseName = {course.name} univ={course.univ} />
			</div>
		);
	});
	return (
		<div>
			{courses}
		</div>
		);
}

export default CourseList;