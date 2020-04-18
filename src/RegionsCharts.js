/**
 * States/Regions summary chart
 *   
 * Author: lcucos
 * Date  : March 30 2020
 */

import React, { Component } from 'react'
import './styles.css';
import { Line, XAxis, YAxis, Tooltip, Legend, ComposedChart, Area, ReferenceLine} from 'recharts'
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import {exponentialClustering} from './Utils.js'
import BarChartGrowthRateAllNow from './BarChartGrowthRateAllNow.js'

// TODO: look for least square line fitting 
// https://medium.com/@sahirnambiar/linear-least-squares-a-javascript-implementation-and-a-definitional-question-e3fba55a6d4b
const CustomTooltip = props => {
    if (!props.active || !props.payload) {
      return null
    }
    // mutating props directly is against react's conventions
    // so we create a new payload with the name and value fields set to what we want
    
    const newPayload = []
    const hs = props.payload.length/2
    for(var i=0;i<hs;i++){
        if(props.payload[i].stroke === undefined){
            continue
        }
        newPayload.push({
            name : props.payload[i].name,
            value:"" + 
                (props.payload[i+hs] !== undefined ? Number(props.payload[i+hs].value).toLocaleString() + " /day, ":"")+
                Number(props.payload[i].value).toLocaleString() + " total",
            color: props.payload[i].color
        })
    }
    //console.dir(props.payload)
    // we render the default, but with our overridden payload
    return <DefaultTooltipContent {...props} payload={newPayload} />;
  };

const Checkbox = props => (
    <input type="checkbox" {...props} />
)

export default class RegionsChart extends Component{
    
    constructor(props) {
        super(props);
        
        this.state = {
            statesSummary:props.prepData,
            statesGroups:exponentialClustering(props.prepData,"deaths"),
            arrDays:[],
            showStayAtHomeOrderLine:true,
            showAllStatesFlag:false,
            stateInfo:props.mapStateData
        }
     }

     prepareLogData(data){
        var arrOut = []
        //console.dir(data)
        for(var i=0;i<data.length;i++){         
            var obj = {
                index:data[i].displayDate
            }
            arrOut.push(obj);
            
            Object.keys(data[i].mapPositives).forEach(function(key) {
                
                var positive=data[i].mapPositives[key].positive
                var deaths=data[i].mapPositives[key].deaths
                var stateInfo = i
                if(positive >= 10){
                    /*
                    var stateInfo = mapStatesInfo[key]
                    if(stateInfo === undefined){
                        mapStatesInfo[key]=stateInfo=i //0 to all start from 0
                    }
                    mapStatesInfo[key] = stateInfo+1
                    */                    
                    arrOut[stateInfo][key+"_positive"]=positive
                }
                if(deaths>=1){
                    arrOut[stateInfo][key+"_death"]=deaths
                }
            });
        }
        //console.dir(arrOut)
        return arrOut
     }

     prepareData(data){
        //console.dir(data)
        var mapDays={}
        var firstDayMap={}
        var lastDaySatesMap={}
        const arrDays=[]

        for(var i=data.length-1;i>=0;i--){         
            var date=new Date(data[i].dateChecked)
            
            const month = date.toLocaleString('default', { month: 'short' });
            data[i].displayDate= month +"/"+ date.getUTCDate()
            
            var dayObj = mapDays[data[i].date]                        
            if(dayObj=== undefined){
                mapDays[data[i].date]=dayObj={
                    displayDate: data[i].displayDate,
                    actualDate : date,
                    mapPositives:{},
                    count:0
                }
                arrDays.push(dayObj)
            }
            const stateID=data[i].state
            lastDaySatesMap[stateID] = data[i]

            const stateTotalId=stateID+"_deaths"
            const statePositiveId=stateID+"_positive"
            const stateTestsId=stateID+"_tests"
            dayObj[stateTestsId] = data[i].totalTestResults
            
            if(firstDayMap[stateID] === undefined && !!data[i].positive){
                firstDayMap[stateID]=date
                //console.log("firstCase:"+stateID +":"+date + " " +data[i].positive)
            }

            if(data[i].death !== undefined && data[i].death >0){
                if(dayObj[stateTotalId]===undefined){
                    dayObj[stateTotalId] = 0
                }
                dayObj[stateTotalId]+=data[i].death
            }
            if(data[i].positive!==undefined && data[i].positive > 0){
                if(dayObj[statePositiveId]===undefined){
                    dayObj[statePositiveId] = 0
                }
                dayObj[statePositiveId]+=data[i].positive
            }
            if(data[i].positiveIncrease !== undefined && data[i].positiveIncrease > 0){            
                const statePositiveIncId=stateID+"_positiveInc"
                dayObj[statePositiveIncId]=data[i].positiveIncrease
            }

            if(data[i].deathIncrease !== undefined && data[i].deathIncrease > 0){
                const stateDeathIncId=stateID+"_deathsInc"
                dayObj[stateDeathIncId]=data[i].deathIncrease
            }

            dayObj.mapPositives[stateID]={
                deaths:dayObj[stateTotalId],
                positive:dayObj[statePositiveId]
            }
            //dayObj.mapDeaths[stateID]=dayObj[statePositiveId]
        }
        // prepare last day values 
        //console.dir(arrDays)
  /*
        var totDeaths = 0        
        var log2=Math.log(2)

        var newStateSummary=this.state.statesSummary
        for (i = 0; i < newStateSummary.length; i++) {
            var item = newStateSummary[i]
            if(!!item.deaths){
                totDeaths += item.deaths            
            }
            var dt=new Date(item.stayhomeorder)
            if(dt.getTime()=== dt.getTime()){
                var daySH=this.getFormattedDate(dt)
                item.daySH = daySH                
                //console.log(item.stateCode + " : " + mapDays[daySH][item.stateCode+"_positive"])
                //console.dir(item.stateCode + " : " + this.getFormattedDate(dt))
            }
            var prevPositive = arrDays[arrDays.length - this.state.averageDays -1][item.stateCode+"_positive"]
            var crtPositives = arrDays[arrDays.length-1][item.stateCode+"_positive"]//item.positive
            item.positivegrowthrate=  !!prevPositive? Math.log(crtPositives/prevPositive)/(this.state.averageDays * log2) : 0

            var crtDeaths = arrDays[arrDays.length-1][item.stateCode+"_deaths"]//item.deaths
            //console.log(item.stateCode + " : Deaths: " + crtDeaths + " <> " +item.deaths  + ", Positives: " + crtPositives + " <> " + item.positive)
            var prevDeaths = arrDays[arrDays.length - this.state.averageDays -1][item.stateCode+"_deaths"]
            item.deathgrowthrate=  !!prevDeaths? Math.log(crtDeaths/prevDeaths)/(this.state.averageDays * log2) : 0
        }
        
        console.log("Total deaths = " + totDeaths)
*/        
        //console.dir(arrDays)
        this.setState({
            arrDays:arrDays,
            arrRelDays:this.prepareLogData(arrDays),
        })
     }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch("https://covidtracking.com/api/states/daily.json")
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

    plotStayHomeMarker(stateCode){
        if(this.state.showStayAtHomeOrderLine === false){
            return ("")
        }
        const color = this.state.stateInfo[stateCode].color
        
        return (!!this.state.stateInfo[stateCode].stayHomeDayMarker ? 
            (<ReferenceLine key = {stateCode+"shdm"} x={this.state.stateInfo[stateCode].stayHomeDayMarker} stroke={color} strokeDasharray="3 3" />)
            :(""))
    }

    plotState(yLabel){
        const stateCode=yLabel.replace(/_.*/, '')
        const color = this.state.stateInfo[stateCode].color
                
        return (
            <Line connectNulls type="monotone" 
            name={stateCode} 
            key = {yLabel} 
            dataKey={yLabel} 
            stroke={color} 
            strokeWidth={2}  
            dot={false}
            />            
            )
    }
    plotStateIncrease(yLabel){
        const stateCode=yLabel.replace(/_.*/, '')        
        const color = this.state.stateInfo[stateCode].color
        //console.log("plot : "+yLabel)
        return(
            <Area type='monotone' 
            dataKey={yLabel} 
            key = {yLabel} 
            fill={color} 
            legendType="none"
            stroke={color}/>
        )
    }
    formatYAxis(tickItem) {
        return Number(tickItem).toLocaleString()
    }

    getGroupNames(arrStates){
        var arr=arrStates.map(item=>(this.state.stateInfo[item].stateName))
        return (arr.join(" / "))
    }
    
    plotGroup(groupData, keyID){
        const chartHeight = 250
        const chartWidth  = 640
        const arrStates = groupData.arrData
        const bucketInfo = groupData.bucket
        if(keyID > 3 && this.state.showAllStatesFlag===false){
            return("")
        }
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
                Positives
                <ComposedChart
                className='recharts-cartesian-axis'
                width={chartWidth}            
                height={chartHeight}
                data={this.state.arrDays}
                isAnimationActive={false}  
                margin={{top: 10, right: 10, left: 10, bottom: 5}}
                >
                <XAxis dataKey="displayDate"/>
                <YAxis scale="log" domain={["auto", "auto"]} tickFormatter={this.formatYAxis}/>
                <Tooltip content={ <CustomTooltip/> }/>                
                {arrStates.map(item => (this.plotState(item+"_positive")))}
                {arrStates.map(item => (this.plotStateIncrease(item+"_positiveInc")))}
                {arrStates.map(item => (this.plotStayHomeMarker(item)))}
                <Legend/>
                </ComposedChart>
            </div>
            <p/>
            <p/>
            <div className='recharts-cartesian-axis'>
                Deaths
                <ComposedChart
                className='recharts-cartesian-axis'
                width={chartWidth}            
                height={chartHeight}
                data={this.state.arrDays}
                isAnimationActive={false}  
                margin={{top: 10, right: 10, left: 10, bottom: 5}}
                >
                <XAxis dataKey="displayDate"/>
                <YAxis scale="log" domain={["auto", "auto"]} tickFormatter={this.formatYAxis}/>
                <Tooltip content={ <CustomTooltip/> }/>
                {arrStates.map(item => (this.plotState(item+"_deaths")))}
                {arrStates.map(item => (this.plotStateIncrease(item+"_deathsInc")))}
                {arrStates.map(item => (this.plotStayHomeMarker(item)))}
                <Legend/>
                </ComposedChart>
            </div>
            <p/>            
            </div>
            <hr/>
            </div>
        )
    }

    plotLogState(yLabel){
        const stateCode=yLabel.replace(/_.*/, '')
        const color = this.state.stateInfo[stateCode].color

        return (
            <Line connectNulls type="monotone" 
            name={stateCode} 
            key = {yLabel} 
            dataKey={yLabel} 
            stroke={color} 
            strokeWidth={1}  
            dot={false}
            />
            )
    }

    renderTooltipAllStatesChart(props) {
        if(props.payload.length===0){
            return ("")
        }
        return (
            <div className="grid_container_tooltip" >
            <div style={{textAlign:"center"}}>{props.label}</div>
            <div className="grid_allstates_chart_tooltip">
            {props.payload.map(item=>(<><div key={1} align='left' style={{color:item.color}}>{item.name}</div>
                                        <div key={2} align='left' style={{color:item.color}}>: {Number(item.value).toLocaleString()}</div> </>))}
            </div>
            </div>
        )
      }

    logAllStates(){
        const chartHeight = 350
        const chartWidth  = 640
        if(this.state.arrRelDays ===undefined){
            return
        }
        return (
            <div>
            <div ><b>Progression All States</b></div>                
            <div className='recharts-cartesian-axis'>(log scale)</div>
            <p style={{paddingBottom:'1px'}}/>
            <div className='row-components'>
                <div className='recharts-cartesian-axis'>
                Positives
            <ComposedChart
            className='recharts-cartesian-axis'
            width={chartWidth}            
            height={chartHeight}
            data={this.state.arrRelDays}
            isAnimationActive={false}  
            margin={{top: 10, right: 10, left: 10, bottom: 5}}
            >
            <XAxis dataKey="index"/>
            <YAxis scale="log" domain={["auto", "auto"]} tickFormatter={this.formatYAxis}/>
            <Tooltip content={this.renderTooltipAllStatesChart} />            
            {this.state.statesSummary.map(item => (this.plotLogState(item.stateCode+"_positive")))}
            </ComposedChart>
            </div>

            <div className='recharts-cartesian-axis'>
                Deaths
            <ComposedChart
            className='recharts-cartesian-axis'
            width={chartWidth}            
            height={chartHeight}
            data={this.state.arrRelDays}
            isAnimationActive={false}  
            margin={{top: 10, right: 10, left: 10, bottom: 5}}
            >
            <XAxis dataKey="index"/>
            <YAxis scale="log" domain={["auto", "auto"]} tickFormatter={this.formatYAxis}/>
            <Tooltip content={this.renderTooltipAllStatesChart} />            
            {this.state.statesSummary.map(item => (this.plotLogState(item.stateCode+"_death")))}
            </ComposedChart>
            </div>
            </div>
            </div>
        )
    }

    handleCheckboxChange = event =>
    this.setState({ showStayAtHomeOrderLine: event.target.checked })

    showAllStates = event =>
    this.setState({ showAllStatesFlag: !this.state.showAllStatesFlag })


    render () {
        if(this.state.arrDays === undefined){
            return
        }
        //console.log("render: regionsCharts : " + this.state.arrDays.length)

        var keyID=0
        return (
            <div>
                {this.state.arrDays.length>0 ? (
                <>
                    <BarChartGrowthRateAllNow data={this.state.statesSummary} arrDays={this.state.arrDays} mapStates={this.state.stateInfo} configIndex={0}/>
                </>
                ):""}
                <p style={{paddingBottom:'10px'}}/>
                {this.logAllStates()}
                <p style={{paddingBottom:'1px'}}/>
                <div style={{textIndent: '30px'}}><b>Progression by State</b></div>                
                <div style={{textIndent: '30px'}}className='recharts-cartesian-axis'>(log scale)</div>
                <div className='center_right_left_container'>  
                    <div style={{display: 'inline-block', textIndent: '100px',margin:'0 auto'}}>
                    </div>
                    <div className='.recharts-cartesian-axis' style={{float:'right', color:'gray', fontSize: '0.9rem'}}>
                        States grouped on logarithmic buckets by total Deaths
                    </div>
                <label className='.recharts-cartesian-axis' style={{float:'left', color:'gray', fontSize: '0.9rem'}}>
                <Checkbox 
                    checked={this.state.showStayAtHomeOrderLine}
                    onChange={this.handleCheckboxChange}
                />
                <span>Show marker for 'Stay-At-Home Order'</span>
                </label>

                </div>
                <p/>
                <p/>                                    
                {this.state.statesGroups.map(item => (this.plotGroup(item,keyID++)))}
                <p/>
                <button className='.recharts-cartesian-axis' onClick={this.showAllStates}>{this.state.showAllStatesFlag?"Show Only Most Affected":"Show All States"}</button>
                <p/>
                
            </div>
        )
    }
}