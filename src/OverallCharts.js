/**
 * Summary info and visualization toggle buttons 
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import './styles.css';
import { LineChart,  AreaChart, Area, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import {Colors} from './Colors.js'

export default  class OverallCharts extends Component{
    chartWidth = 600

    constructor(props) {
       super(props);

       this.state = {rawData:null
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

     areaChart(color,yKey,yLabel, height){
         const colorID="colorUv"+color
         const fillColor="url(#"+colorID+")"
         return(
             <div>
            <AreaChart
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
            <YAxis tickFormatter={this.formatYAxis}/>
            <Tooltip>
            </Tooltip>
            <Legend />
            <Area type="monotone" dataKey={yKey} name={yLabel} stroke={color} fillOpacity={1} fill={fillColor}/>
           </AreaChart>
           </div>
         )
     }    

     lineChart(color,yKey,yLabel, height, title){
        //   <CartesianGrid strokeDasharray="3 3"/>
        return (
            <div className='recharts-cartesian-axis'>
                <b>{(!!title?title:null)}</b>
            <LineChart
                className='recharts-cartesian-axis'
                width={this.chartWidth}            
                height={height}
                data={this.state.rawData}
                margin={{top: 10, right: 30, left: 20, bottom: 5}}
                >
                <XAxis dataKey="displayDate"/>
                <YAxis tickFormatter={this.formatYAxis}/>
                <Tooltip>
                </Tooltip>
                <Legend />
                <Line type="monotone" dataKey={yKey} name={yLabel} stroke={color} dot={false} strokeWidth={3}/>
            </LineChart>
            </div>
        )
     }

     render () {
        const chartHeightTotals = 300
        const chartHeightPerDay = 200
        return (
            <div>
            <b>Evolution Nationwide</b>

            <div className='row-components'>            
            {this.lineChart(Colors.positive, "positive", "Total", chartHeightTotals, "Positive")}
            {this.lineChart(Colors.death, "death", "Total", chartHeightTotals,"Deaths")}
            </div>

            <div className='row-components'>            
            {this.areaChart(Colors.positive, "positiveIncrease", "Daily",chartHeightPerDay)}
            {this.areaChart(Colors.death, "deathIncrease", "Daily",chartHeightPerDay)}
            </div>

            <br/>
            <br/>
            <br/>
            </div>
            );
     }
}