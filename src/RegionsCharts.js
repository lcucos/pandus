/**
 * States/Regions summary chart
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import './styles.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts'
import {exponentialClustering} from './Utils.js'

export default class RegionsChart extends Component{
    stateInfo={}
    constructor(props) {
        super(props);
        
        this.state = {
            statesSummary:props.prepData,
            statesGroups:exponentialClustering(props.prepData,"deaths"),
            arrDays:[]
        }
        //console.dir(props.prepData)
        var data=props.prepData
        for(var i=0;i<data.length;i++){
            this.stateInfo[data[i].stateCode]={
                color:data[i].color,
                name:data[i].stateName
            }
        }
     }

     prepareData(data){
        //console.dir(data)
        var mapDays={}
        for(var i=data.length-1;i>=0;i--){         
            var date=new Date(data[i].dateChecked)
            
            const month = date.toLocaleString('default', { month: 'short' });
            data[i].displayDate= month +"/"+ date.getUTCDate()
           
            var dayObj = mapDays[data[i].date]                        
            if(dayObj=== undefined){
                mapDays[data[i].date]=dayObj={
                    displayDate: data[i].displayDate,
                    count:0
                }
            }
            //console.dir(data[i])
            const stateID=data[i].state
            
            const stateTotalId=stateID+"_deaths"
            const statePositiveId=stateID+"_positive"
            if(dayObj[stateTotalId]===undefined){
                dayObj[stateTotalId] = 0
            }
            if(dayObj[statePositiveId]===undefined){
                dayObj[statePositiveId] = 0
            }
            dayObj[stateTotalId]+=data[i].death
            dayObj[statePositiveId]+=data[i].positive
        }
        const arrDays=[]
        for (var key in mapDays) {
            if (mapDays.hasOwnProperty(key)) {
                arrDays.push(mapDays[key])
            }
        }
        //console.dir(arrDays)
        this.setState({
            arrDays:arrDays
        })
     }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch("https://covidtracking.com/api/states/daily")
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

    plotState(yLabel){
        const stateCode=yLabel.replace(/_.*/, '')
        const color = this.stateInfo[stateCode].color
        
        return (<Line connectNulls type="monotone" 
            name={stateCode} 
            key = {yLabel} 
            dataKey={yLabel} 
            stroke={color} 
            strokeWidth={2}  
            dot={false}
            />)
    }

    formatYAxis(tickItem) {
        return Number(tickItem).toLocaleString()
    }

    getGroupNames(arrStates){
        var arr=arrStates.map(item=>(this.stateInfo[item].name))
        return (arr.join(" / "))
    }
    
    plotGroup(groupData, keyID){
        const chartHeight = 250
        const chartWidth  = 600
        const arrStates = groupData.arrData
        const bucketInfo = groupData.bucket
        return (
            
            <div key={keyID} className='charts_title'>
                <p/>
                <p/>                    
                <div className='center_right_left_container'>  
                    <div style={{display: 'inline-block', textIndent: '100px',margin:'0 auto'}}>
                       <b> {this.getGroupNames(arrStates)}</b>
                    </div>
                    <div className='.recharts-cartesian-axis' style={{float:'right', color:'gray',fontSize: '0.9rem'}}>
                        [{bucketInfo.start},{bucketInfo.stop})
                    </div>
                </div>
                <p/>
                <p/>                                    
            <div className='row-components'>  
            <div className='recharts-cartesian-axis'>
                Positive
                <LineChart
                className='recharts-cartesian-axis'
                width={chartWidth}            
                height={chartHeight}
                data={this.state.arrDays}
                margin={{top: 10, right: 30, left: 20, bottom: 5}}
                >
                <XAxis dataKey="displayDate"/>
                <YAxis tickFormatter={this.formatYAxis}/>
                <Tooltip/>
                
                {arrStates.map(item => (this.plotState(item+"_positive")))}
                <Legend/>
                </LineChart>
            </div>
            <p/>
            <p/>
            <div className='recharts-cartesian-axis'>
                Deaths
                <LineChart
                className='recharts-cartesian-axis'
                width={chartWidth}            
                height={chartHeight}
                data={this.state.arrDays}
                margin={{top: 10, right: 30, left: 20, bottom: 5}}
                >
                <XAxis dataKey="displayDate"/>
                <YAxis tickFormatter={this.formatYAxis}/>
                <Tooltip/>
                
                {arrStates.map(item => (this.plotState(item+"_deaths")))}
                <Legend/>
                </LineChart>
            </div>
            <p/>            
            </div>
            <hr/>
            </div>
        )
    }

    render () {
        if(this.state.arrDays === undefined){
            return
        }
        var keyID=0
        return (
            <div>
                <p/>                    
                <p/>
                <b>Evolution by State</b>
                <div className='center_right_left_container'>  
                    <div style={{display: 'inline-block', textIndent: '100px',margin:'0 auto'}}>
                    </div>
                    <div className='.recharts-cartesian-axis' style={{float:'right', color:'gray', fontSize: '0.9rem'}}>
                        States grouped on logarithmic buckets by total Deaths
                    </div>
                </div>
                <p/>
                <p/>                                    
                
                {this.state.statesGroups.map(item => (this.plotGroup(item,keyID++)))}
                <p/>
                <p/>
                
            </div>
        )
    }
}