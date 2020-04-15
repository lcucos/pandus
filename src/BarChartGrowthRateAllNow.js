import React, { Component, PureComponent} from 'react'
import {Tooltip, BarChart,Bar, XAxis, YAxis, Legend} from 'recharts'
import {Colors} from './Colors.js'
import './styles.css';
import './BarChartGrowthRateAllNow.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class CustomizedAxisTick extends PureComponent {
    render() {
      const {
        x, y, payload,
      } = this.props;
  
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={10} textAnchor="end" fill="#666" transform="rotate(-40)" fontSize={12}>{payload.value}</text>
        </g>
      );
    }
  }

const log2=Math.log(2)


export default class BarChartGrowthRateAllNow extends Component{
    barInfo=[{
        yKey    : "positivegrowthrate",
        legend  : "Positives Now",
        color   : Colors.positive
      },
      {
        yKey    : "deathgrowthrate",
        legend  : "Deaths Now",
        color   : Colors.death
      },
      {
        yKey    : "positivegrowthrate_sho",
        legend  : "Positives SHO",
        color   : "#4f8bf9"
      },
      {
        yKey    : "deathgrowthrate_sho",
        legend  : "Deaths SHO", 
        color   : "#e2884d" 
      }
    ]
    defaultAverageDays      = 3

    defaultSortFieldIndex   = 0 // positive

    sortField=this.barInfo[this.defaultSortFieldIndex].yKey
    config=[
        {
            title:"Now",
        },
        {
            title:"when Stay-At-Home Order (SHO) was issued",
        }
    ]

    constructor(props){
        super(props)
        
        if(props.data === undefined){
            return
        }        
        // create a list of configurations
        this.state = {
            data:props.data,
            configIndex:props.configIndex,
            averageDays:this.defaultAverageDays,
            mapStates:props.mapStates,
            sortMode:this.defaultSortFieldIndex,
            dataShowMode:'ns',
            arrDays:props.arrDays,            
            renderData : this.computeGrowth(props.arrDays, props.data, this.defaultAverageDays, this.config[props.configIndex])
        }
        this.sortSelectionChange = this.sortSelectionChange.bind(this);
        this.radioChangeSelectData =this.radioChangeSelectData.bind(this)
        this.renderTooltipBarChart = this.renderTooltipBarChart.bind(this)
        this.sortData = this.sortData.bind(this)
    }

    getFormattedDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year+month + day;
      }

    getDayIndex(date1, dateFrom){
        return Math.ceil((dateFrom.getTime()-date1.getTime())/86400000)
    }

    getGrowthRate(lastElem, arrDays, averageDays, field){
        var prevPositive = arrDays[lastElem - averageDays][field]
        var crtPositives = arrDays[lastElem][field]
        return !!prevPositive? Math.log(crtPositives/prevPositive)/(averageDays * log2) : 0
    }
    
    getIndexReference_Last(item, arrDays, averageDays, obj){
        var lastElem = arrDays.length-1
        obj.positivegrowthrate = this.getGrowthRate(lastElem, arrDays, averageDays, item.stateCode+"_positive")
        obj.deathgrowthrate    = this.getGrowthRate(lastElem, arrDays, averageDays, item.stateCode+"_deaths")
    }

    getIndexReference_SHO(item, arrDays, averageDays, obj){
        var lastDayDate = arrDays[arrDays.length-1].actualDate
        var dt = new Date(item.stayhomeorder)
        if(dt.getTime() === dt.getTime()){
            var delta = Math.ceil((lastDayDate.getTime()-dt.getTime())/86400000)
            var lastElem = arrDays.length - delta
            obj.positivegrowthrate_sho = this.getGrowthRate(lastElem, arrDays, averageDays, item.stateCode+"_positive")
            obj.deathgrowthrate_sho    = this.getGrowthRate(lastElem, arrDays, averageDays, item.stateCode+"_deaths")
        }else{
            // no Stay-At-Home order
            return null
        }
    }

    computeGrowth(arrDays, newStateSummary,  averageDays, crtConfig){
        if(arrDays.length === 0){
            return null
        }
        var renderData=[]
        for (var i = 0; i < newStateSummary.length; i++) {
            var item = newStateSummary[i]
            var obj ={
                stateCode: item.stateCode
            }
            this.getIndexReference_SHO(item, arrDays, averageDays, obj)
            this.getIndexReference_Last(item, arrDays, averageDays, obj)
            renderData.push(obj);
        }
        return renderData
        //console.log("Total deaths = " + totDeaths)
    }

    sortbyBoth(a,b){
        return a["positivegrowthrate"]+a["deathgrowthrate"] < b["positivegrowthrate"] + b["deathgrowthrate"]? -1 : 1
    }
    sortData(a,b){
        var a1=!!a[this.sortField]?a[this.sortField]:-1
        var b1=!!b[this.sortField]?b[this.sortField]:-1
        return a1 < b1? -1 : 1
    }

    renderTooltipBarChart(props) {
        var label = props.label
        var stateObj = this.state.mapStates[props.label]
        if(props.payload.length > 0){
            label = this.state.mapStates[props.label].stateName
        }
        
        
        return (
            <div className="grid_container_tooltip" >
            <div style={{textAlign:"center"}}>{label}</div>
            <div className="grid_bar_chart_growth_tooltip">
            {props.payload.map(item=>(
                         <>
                             <div align='left'  style={{color:item.color}}>{item.name}</div>
                             <div align='center' style={{color:item.color}}>:</div>
                             <div align='right' style={{color:item.color}}>{item.value.toFixed(4)}</div> 
                             <div align='left'   style={{color:item.color, marginLeft:'8px'}}> {(item.value!==0 ? " = "+(1/item.value).toFixed(2) + " days to double": "") + 
                                                                                                (item.value < 0?" (data error or correction)":"")}</div>
                         </>
                 ))}
            </div>
            <div align="left" style={{paddingLeft:'20px'}}><i>
            Stay at Home Order : {!!stateObj && stateObj.stayhomeorder? stateObj.stayhomeorder : "Not issued"}
            </i></div>
            </div>
        )
      }

    sortSelectionChange(e) {        
        this.setState({sortMode: e.value});
    }

    radioChangeSelectData(e) {
        this.setState({
            dataShowMode: e.currentTarget.value
        });
    }

    getDataSelectionOptions(){
        if(this.state.dataShowMode === 'n'){
            return {
                    title:this.config[0].title,
                    sortBy:this.state.sortMode%2,
                    sortOptions:[this.barInfo[0],this.barInfo[1]]
                   }
        }else if(this.state.dataShowMode === 's'){
            return {
                    title:this.config[1].title,
                    sortBy:this.state.sortMode%2,
                    sortOptions:[this.barInfo[2],this.barInfo[3]]
                   }
        }else{
            return {
                    title:this.config[0].title + " & " + this.config[1].title,
                    sortBy:this.state.sortMode,
                    sortOptions:this.barInfo
                   }
        }
    }
    getSortOptions(confArr){
        var out = []
        var i = 0
        for(var item in confArr){            
            out.push({label:confArr[item].legend, value:i++})
        }
        return out
    }
    render(){     
        if(this.state.renderData == null)   {
            return ("")
        }
        const xLabel = "stateCode"
        var currentDataSelection = this.getDataSelectionOptions()

        // important to set the sort field before calling sort function 
        this.sortField = currentDataSelection.sortOptions[currentDataSelection.sortBy].yKey
        this.state.renderData.sort(this.sortData)

        const sortOptions = this.getSortOptions(currentDataSelection.sortOptions)
        
        const i1 = currentDataSelection.sortBy
        const i2 = (i1+1)%(sortOptions.length)
        const i3 = (i1+2)%(sortOptions.length)
        const i4 = (i1+3)%(sortOptions.length)

        return(
            <div align="center">
            <p style={{paddingBottom:'10px'}}/>
            <b>Growth Rate {currentDataSelection.title}</b>
            <br/>
            <div className='recharts-cartesian-axis'>(based on {this.state.averageDays} days average)</div>
            
            <table width="100%">
        <tbody>
          <tr>
            <td style={{width: '1050px'}}> 

                    <div align="left" className='recharts-cartesian-axis' style={{paddingLeft:'60px'}}>
                        Show 
                    <input type="radio"
                        value="n"
                        checked={this.state.dataShowMode === "n"}
                        onChange={this.radioChangeSelectData} />Now
                    <input type="radio"
                        value="s"
                        checked={this.state.dataShowMode === "s"}
                        onChange={this.radioChangeSelectData}/>SHO
                    <input type="radio"
                        value="ns"
                        checked={this.state.dataShowMode === "ns"}
                        onChange={this.radioChangeSelectData}/>Both
                     </div> 
            </td>
            <td aling="right" className='recharts-cartesian-axis'>
                Sort by 
            </td>
            <td>
                        <Dropdown align="right" className='recharts-cartesian-axis' 
                          onChange={this.sortSelectionChange}  
                          options={sortOptions} 
                          value={sortOptions[currentDataSelection.sortBy]} 
                          style={{width:"150px"}} 
                          />
            </td>
          </tr>
          </tbody>
        </table>

            <p style={{paddingBottom:'30px'}}/>
            <BarChart
            className='recharts-cartesian-axis'
            width={1280}           
            height={250}
            data={this.state.renderData}
            isAnimationActive={false}  
            margin={{top: 10, right: 5, left: 0, bottom: 5}}
       >
           <XAxis dataKey={xLabel} tick={<CustomizedAxisTick/>} minTickGap={-5}/>
           <YAxis/>
           <Tooltip content={this.renderTooltipBarChart}/>
           <Legend />           
           {this.state.dataShowMode.includes("n")?(
                <Bar dataKey={currentDataSelection.sortOptions[i1].yKey} stackId="a" name={currentDataSelection.sortOptions[i1].legend} stroke={currentDataSelection.sortOptions[i1].color} fill={currentDataSelection.sortOptions[i1].color}/>
           ):""}
           {this.state.dataShowMode.includes("n")?(
                <Bar dataKey={currentDataSelection.sortOptions[i2].yKey} stackId="a" name={currentDataSelection.sortOptions[i2].legend} stroke={currentDataSelection.sortOptions[i2].color} fill={currentDataSelection.sortOptions[i2].color}/>
           ):""}
           {this.state.dataShowMode.includes("s")?(
               <Bar dataKey={currentDataSelection.sortOptions[i3].yKey} stackId="a" name={currentDataSelection.sortOptions[i3].legend} stroke={currentDataSelection.sortOptions[i3].color} fill={currentDataSelection.sortOptions[i3].color}/>
           ):""}
           {this.state.dataShowMode.includes("s")?(
               <Bar dataKey={currentDataSelection.sortOptions[i4].yKey} stackId="a" name={currentDataSelection.sortOptions[i4].legend} stroke={currentDataSelection.sortOptions[i4].color} fill={currentDataSelection.sortOptions[i4].color}/>
           ):""}

          </BarChart>
          </div>
        )
    }    

}