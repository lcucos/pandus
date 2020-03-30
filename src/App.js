/**
 * Main React Component  
 * 
 * Author: lcucos
 * Date  : March 25 2020
 */

import React, { Component } from 'react'
import MapChart from './MapChart.js'
import PageHeader from "./PageHeader.js";
import PageFooter from "./PageFooter.js";
import StatesTable from "./StatesTable.js"
import ToggleButtonSummary from './ToggleButtonSummary.js';

import allStates from "./data/maps/us/allstates.json";
import statesGeo from "./data/maps/us/states-10m.json";

class App extends Component {

   constructor(props) {
      super(props);

      this.state = {
        arrStates:[],
        mapStatesByGeoId:{},
        isLoading: false,
        error: null,
      };
      this.summary={
         lastUpdate:'',
         positives:0,
         deaths:0,
         tests:0,
         hospitalized:0
      }
      this.statesGeo = statesGeo
      // set default data view flags
      // possible options: "tests","positives","hospitalized","deaths"
      this.showFlags=["positives", "deaths"];
   }
  
   preapreData(data){
      // preapare geo lookup map and array
      var idsMap={};
      var valMap={};
      var arrStates = []
      var mapStatesByGeoId = {}
      for (var i = 0; i < allStates.length; i++) {
         idsMap[allStates[i].id] = allStates[i];
         valMap[allStates[i].val] = allStates[i];
      }
      var statesStatus = data
      this.summary.positives =0
      this.summary.deaths =0
      this.summary.tests =0
      this.summary.hospitalized =0
      for (i = 0; i < statesStatus.length; i++) {
         var stateObj = idsMap[statesStatus[i].state]
         // compute summaries
         if(this.summary.lastUpdate.localeCompare(statesStatus[i].lastUpdateEt) < 0){
            this.summary.lastUpdate = statesStatus[i].lastUpdateEt;
         }
         this.summary.positives+=statesStatus[i].positive
         this.summary.deaths+=statesStatus[i].death
         this.summary.tests+=statesStatus[i].total
         this.summary.hospitalized+=statesStatus[i].hospitalized
         // prepare object
         var obj = {
            stateName:stateObj.name,
            stateCode:stateObj.id,
            population:stateObj.population,
            tested:statesStatus[i].total,
            deaths:statesStatus[i].death,
            hospitalized:statesStatus[i].hospitalized,
            testsByUnit:Math.round(statesStatus[i].total*1000000/stateObj.population),
            positive:statesStatus[i].positive,
            positivesByUnit:Math.round(statesStatus[i].positive*1000000/stateObj.population),
            deathsByUnit:Math.round(statesStatus[i].death*1000000/stateObj.population),
            lastUpdated:statesStatus[i].lastUpdateEt            
         }
         mapStatesByGeoId[stateObj.val]=obj;
         arrStates.push(obj)
      }
      this.setState({arrStates:arrStates,mapStatesByGeoId:mapStatesByGeoId,isLoading:false})
   }

   componentDidMount() {
      this.setState({ isLoading: true });
      fetch("https://covidtracking.com/api/states")
      .then(response => {
         if (response.ok) {
            var tmp=response.json()
           return tmp;
         } else {
           throw new Error('Something went wrong ...');
         }
       })
       .then(data => {
         this.preapreData(data)
         })
       .catch(error => this.setState({ error, isLoading: false }));
   }
   render(){
      const {error} = this.state;
      
      if (error) {
        return <p>{error.message}</p>;
      }
      
      var sizeMap = Object.keys(this.state.mapStatesByGeoId).length;
      if (this.state.isLoading || sizeMap===0) {
        return <p>Loading data...</p>;
      }
      return ( 
         <center>
         <div style = {{ width: '1200px' }} >
            <PageHeader           lastUpdate={this.summary} showFlags={this.showFlags}/>
            <ToggleButtonSummary  summary   ={this.summary} showFlags={this.showFlags}/>
            <MapChart             data      ={this.state.mapStatesByGeoId} showFlags={this.showFlags} statesGeo={this.statesGeo}/>
            <StatesTable          prepData  ={this.state.arrStates}/>
            <PageFooter/>
            <p/> 
         </div>
         </center>
      );
   }
 }

export default App
