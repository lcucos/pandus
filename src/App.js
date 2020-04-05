/**
 * Main React Component  
 * 
 * Author: lcucos
 * Date  : March 25 2020
 */

import React, { Component } from 'react'
import MapChart from './MapChart.js'
import PageHeader from "./PageHeader.js"
import PageFooter from "./PageFooter.js"
import StatesTable from "./StatesTable.js"
import ToggleButtonSummary from './ToggleButtonSummary.js'
import OverallCharts from './OverallCharts.js'

import allStates from "./data/maps/us/allstates.json"
import statesGeo from "./data/maps/us/states-10m.json"
import RegionsChart from "./RegionsCharts.js"
import PieChartSummary from './DistributionByState.js'

class App extends Component {

   constructor(props) {
      super(props);

      this.state = {
        arrStates:[],
        mapStatesByGeoId:{},
        mapStatesByStateCode:{},
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
      this.showFlags=["positives", "tests","deaths"];
   }
  
   preapreData(data){
      // preapare geo lookup map and array
      var idsMap={};
      var valMap={};
      var arrStates = []
      var mapStatesByGeoId = {}
      var totPopulation = 0
      var mapStatesByStateCode = {}
      for (var i = 0; i < allStates.length; i++) {
         idsMap[allStates[i].id] = allStates[i];
         valMap[allStates[i].val] = allStates[i];
         totPopulation+=allStates[i].population
      }
      var statesStatus = data
      this.summary.positives =0
      this.summary.deaths =0
      this.summary.tests =0
      this.summary.hospitalized =0
      this.summary.totPopulation=totPopulation
      
      var maxTests =0
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
            color:stateObj.color,
            tested:statesStatus[i].totalTestResults,
            deaths:statesStatus[i].death,
            hospitalized:statesStatus[i].hospitalized,
            testsByUnit:Math.round(statesStatus[i].total*1000000/stateObj.population),
            positive:statesStatus[i].positive,
            positivesByUnit:Math.round(statesStatus[i].positive*1000000/stateObj.population),
            deathsByUnit:Math.round(statesStatus[i].death*1000000/stateObj.population),
            lastUpdated:statesStatus[i].lastUpdateEt,
            percentPositiveFromTests:statesStatus[i].positive/statesStatus[i].totalTestResults,
            percentDeaths:0
         }
         maxTests = obj.testsByUnit > maxTests?obj.testsByUnit:maxTests
         
         mapStatesByGeoId[stateObj.val]=obj;
         mapStatesByStateCode[stateObj.id]=obj;
         arrStates.push(obj)
      }
      // compute the color scale factor
      var p = Math.pow(10,Math.ceil(Math.log10(maxTests>0?maxTests:1)))      
      p = (p/maxTests>4)?p/3:p
      var maxTestScale =Math.pow(10,Math.ceil(Math.log10(maxTests)-1))      
      maxTestScale = maxTestScale*Math.ceil(maxTests/maxTestScale)
      
      // compute percent of totals
      for (i = 0; i < arrStates.length; i++) {
         arrStates[i].percentDeaths=arrStates[i].deaths/this.summary.deaths
         // set color
         arrStates[i].testColor = this.getScaleColor(arrStates[i].testsByUnit,p)
      }
      this.summary.maxTestsScale=maxTestScale
      this.summary.maxTestsColor = this.getScaleColor(this.summary.maxTestsScale,p)
      this.setState({arrStates:arrStates,mapStatesByGeoId:mapStatesByGeoId,mapStatesByStateCode:mapStatesByStateCode,isLoading:false})
   }
   getScaleColor(value, factor){
      var v1 =  (256-Math.ceil(256*value/factor)).toString(16)
      return "#"+v1+v1+v1
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
         <div style = {{ width: '1280px' }} >
            <PageHeader           summary  = {this.summary} showFlags={this.showFlags}/>
            <ToggleButtonSummary  summary  = {this.summary} showFlags={this.showFlags}/>
            <MapChart             data     = {this.state.mapStatesByGeoId} showFlags={this.showFlags} statesGeo={this.statesGeo} summary ={this.summary}/>
            <OverallCharts/>
            <StatesTable          prepData = {this.state.arrStates} summary ={this.summary}/>
            <PieChartSummary      prepData = {this.state.arrStates} mapStateData={this.state.mapStatesByStateCode} summary  = {this.summary}/>
            <RegionsChart         prepData = {this.state.arrStates}/>
            <PageFooter/>
            <p/> 
         </div>
         </center>
      );
   }
 }

export default App
