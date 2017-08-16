import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CourseThreads from './courseThreads';
import Courses from './courses';
import NotFound from './notFound';
import axios from 'axios';

//Routing for the React Application
export const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Courses} />
      <Route exact path="/course/:id/:num" component={CourseThreads} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
