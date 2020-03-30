import React, { Component } from 'react'
import './styles.css';

export default  class PageFooter extends Component{

    constructor(props) {
       super(props);
       this.summary = props.lastUpdate
    }

    render(){
       return (
        <div align='left' className="StylesParagraph">
         <p>* Population numbers from <a href="https://en.wikipedia.org/wiki/List_of_states_and_territories_of_the_United_States_by_population">States and territories of the United States by population</a> - July 2019 estimate
         </p>
         <p>
         ** All values are dependent on data source accuracy.
         </p>
         <hr/>
         <p>
         Project available on github  : <a href="https://github.com/lcucos/pandus">https://github.com/lcucos/pandus</a>
         </p>
        </div>
       );
    }
 }
