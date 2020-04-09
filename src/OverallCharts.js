/**
 * Summary info and visualization toggle buttons 
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import './styles.css';
import {Area, Line, XAxis, YAxis, Tooltip, Legend, ComposedChart} from 'recharts';
import { FormControl,FormControlLabel,Radio, RadioGroup} from '@material-ui/core';


import {Colors} from './Colors.js'

export function  updateScaleType(data){
    this.setState({scaleFlags:data})  
}

function RadioButtons(props) {
    const [, setSelectedValue] = React.useState('a');
  
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
      updateScaleType(event.target.value);
    };
  
    return (
      <div >
    <FormControl component="fieldset" className='recharts-cartesian-axis'>
      <RadioGroup row aria-label="position" name="position" defaultValue={props.defaultValue} >
        <FormControlLabel value="log" control={<Radio color="primary" onChange={handleChange} size='small'/>} label="Log" />
        <FormControlLabel value="linear" control={<Radio color="primary" onChange={handleChange} size='small'/>} label="Linear" />
      </RadioGroup>
    </FormControl>
        
      </div>
    );
  }
  

export default  class OverallCharts extends Component{
    chartWidth = 600

    constructor(props) {
       super(props);

       this.state = {rawData:null,
        scaleFlags:"log"
       }
    }

    prepareData(data){
        //console.dir(data)
        // revert the array
        var revertedData=[]
        for(var i=data.length-1;i>=0;i--){
            var date=new Date(data[i].dateChecked)
            const month = date.toLocaleString('default', { month: 'short' });
            data[i].displayDate= month +"/"+ date.getUTCDate()
            revertedData.push(data[i]);
        }
        this.setState({rawData:revertedData})
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        updateScaleType = updateScaleType.bind(this)
        fetch("https://covidtracking.com/api/us/daily")
        .then(response => {
           if (response.ok) {
              var tmp=response.json()
             return tmp;
           } else {
             throw new Error('Something went wrong ...');
           }
         })
         .then(data => {
           this.prepareData(data)
           })
         .catch(error => this.setState({ error, isLoading: false }));
     }

     formatYAxis(tickItem) {
        return Number(tickItem).toLocaleString()
     }

     areaChart(color,yKey,height, title){
         const colorID="colorUv"+color
         const fillColor="url(#"+colorID+")"
         const yKeyD = yKey+"Increase"
         const yLabelT = "Total" 
         const yLabelD = "Daily"
         return(
            <div className='recharts-cartesian-axis'>
                <b>{(!!title?title:null)}</b>

            <ComposedChart
            className='recharts-cartesian-axis'
            width={this.chartWidth}            
            height={height}
            data={this.state.rawData}
            margin={{top: 10, right: 30, left: 20, bottom: 5}}
        >
            <defs>
                <linearGradient id={colorID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="displayDate"/>
            <YAxis scale={this.state.scaleFlags} domain={["auto", "auto"]} tickFormatter={this.formatYAxis}/>
            <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
            <Legend />
            <Line type="monotone" dataKey={yKey} name={yLabelT} stroke={color} dot={false} strokeWidth={3}/>
            <Area type="monotone" dataKey={yKeyD} name={yLabelD} stroke={color} fillOpacity={1} fill={fillColor}/>
           </ComposedChart>
           </div>
         )
     }    

     render () {
        const chartHeightPerDay = 300
        return (
            <div>
            <b>Nationwide Progression</b>

            <RadioButtons defaultValue={this.state.scaleFlags}/>
            <div className='row-components'>            
            {this.areaChart(Colors.positive, "positive", chartHeightPerDay,"Positive")}
            {this.areaChart(Colors.death, "death", chartHeightPerDay,"Deaths")}
            </div>

            <br/>
            <br/>
            <br/>
            </div>
            );
     }
}