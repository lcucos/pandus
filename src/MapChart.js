/**
 * Display a d3 geo map with various statistics
 *   
 * Author: lcucos
 * Date  : March 25 2020
 */

import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import {Colors} from './Colors.js'
import ReactTooltip from "react-tooltip";

const offsets = {
  VT: [90, -50],
  NH: [90, -20],
  MA: [90, 0],
  RI: [90, 25],
  CT: [90, 40],
  NJ: [80, 40],
  DE: [33, 15],
  MD: [60, 40],
  DC: [70, 71]
};

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const radiusPerUnit = 1;
const unitSize = 20;

export function  updateTests(data){
  this.setState({showFlags:this.setUIFlags(data)})  
}


class MapChart extends React.Component {
  width=1040
  height=660
  legendX=740
  legendY=520


  constructor(props){
    super(props);

    this.allData = props.data
    this.statesGeo = props.statesGeo
    this.summary = props.summary
    this.state={
      showFlags:this.setUIFlags(props.showFlags),
      tooltipContent:""
    } 
  }

  setUIFlags(data){
    var result = data.reduce(function(map, obj) {
      map[obj] = obj;
      return map;
    }, {});
    return result
  }

  showCircle(sizeT,showFlag,color,opacity){
    return showFlag===true?(<circle r={sizeT} fill={color} opacity={opacity} />):null
  }
  
  componentDidMount() {
    updateTests = updateTests.bind(this)
  }

  getShowDataFlag(type){
    return this.state.showFlags[type]!== undefined
  }

  getMaxRadius(sizeC, sizeH, sizeD){
    var c =(this.state.showFlags["positives"] === undefined ? 0: sizeC)
    var h =(this.state.showFlags["hospitalized"] === undefined ? 0: sizeH)
    var d =(this.state.showFlags["deaths"] === undefined ? 0: sizeD)
    var maxR = c>h?c:h
    return maxR > d ? maxR : d
  }

  getTooltipContent(geoId){
    if(!!geoId === false){
      return
    }
    var el = this.allData[geoId]
    return (
      <div>
      <strong>{el.stateName}</strong>
      <br/>
        ( {Number(el.population).toLocaleString()} ) <br/> {(el.populationPercent).toFixed(2) + "%"}
      <div className="grid_container_map_tooltip">
        
        <div align='left'  ></div> 
        <div align='right' >Count</div>
        <div align='right' > % of Total</div>

        <div align='left'  style={{color:Colors.test}}>Tests</div> 
        <div align='right' style={{color:Colors.test}}>{Number(el.tested).toLocaleString()}</div>
        <div align='right' style={{color:Colors.test}}>{(el.tested/this.summary.tests * 100).toFixed(1)+"%"}</div>

        <div align='left'  style={{color:Colors.positive}}>Positives</div> 
        <div align='right' style={{color:Colors.positive}}>{Number(el.positive).toLocaleString()}</div>
        <div align='right' style={{color:Colors.positive}}>{(el.positive/this.summary.positives *100).toFixed(1)+"%"}</div>

        <div align='right' style={{color:Colors.positive}}></div> 
        <div align='right' style={{color:Colors.positive}}>({(el.percentPositiveFromTests*100).toFixed(1) +"%"} of tests)</div>
        <div align='right' style={{color:Colors.positive}}></div>

        <div align='left'  style={{color:Colors.hospitalized}}>Hospitalized</div>
        <div align='right' style={{color:Colors.hospitalized}}> {(!!el.hospitalized?Number(el.hospitalized).toLocaleString() :"NA")} </div>
        <div align='right' style={{color:Colors.hospitalized}}>{(!!el.hospitalized?(el.hospitalized/this.summary.hospitalized*100).toFixed(1)+"%" :"NA")}</div>
        

        <div align='left'  style={{color:Colors.icu}} >In ICU</div>
        <div align='right' style={{color:Colors.icu}}> {(!!el.inICUNow?Number(el.inICUNow).toLocaleString():"NA")} </div>
        <div align='right' > </div>

        <div align='left'  style={{color:Colors.ventilator}}>On ventilator</div>
        <div align='right' style={{color:Colors.ventilator}}> {(!!el.onVentilatorNow?Number(el.onVentilatorNow).toLocaleString():"NA")} </div>
        <div align='right' > 
        </div>

        <div align='left'  style={{color:Colors.death}}>Deaths</div>
        <div align='right' style={{color:Colors.death}}> {Number(el.deaths).toLocaleString()} </div>
        <div align='right' style={{color:Colors.death}}>{(el.percentDeaths*100).toFixed(1)+"%"}
        <p style={{paddingBottom:'1px'}}/>
        </div>


        <div align='left'><i>LastUpdate</i></div>
        <div align='right'><i> {el.lastUpdated}</i> </div>
        <div align='right'> </div>

      </div>
      </div>
      )
  }

  // render state info
  stateNamesFunc(geo){
    var stateIDFontSize=12;

    const centroid = geoCentroid(geo);
    var element = this.allData[geo.id];
    if(typeof element === 'undefined'){
      return
    }
    const curid = element.stateCode; 

    var sizeC=(element? element.positive:0)
    //var sizeT=(element? element.tested:0)
    var sizeH=(element? element.hospitalized:0)
    var sizeD=(element? element.deaths:0)

    sizeC = radiusPerUnit * Math.sqrt(sizeC/unitSize)
    //sizeT = radiusPerUnit * Math.sqrt(sizeT/unitSize)
    sizeH = radiusPerUnit * Math.sqrt(sizeH/unitSize)
    sizeD = radiusPerUnit * Math.sqrt(sizeD/unitSize)
    //{this.showCircle(sizeT, this.getShowDataFlag("tests"), Colors.test,0.15)}
    //{this.showCircle(sizeT, this.getShowDataFlag("tests"), Colors.test,0.15)}
    var maxRadius = sizeC > sizeH?sizeC : sizeH
    var textOffsetY = -1*this.getMaxRadius(sizeC, sizeH, sizeD) - 3

    return (
      <g key={geo.rsmKey + "-name"}>
        {
          centroid[0] > -160 &&
          centroid[0] < -67 &&
          (Object.keys(offsets).indexOf(curid) === -1 ? (
            <Marker coordinates={centroid}>
              {this.showCircle(sizeC, this.getShowDataFlag("positives"), Colors.positive,0.6)}
              {this.showCircle(sizeH, this.getShowDataFlag("hospitalized"), Colors.hospitalized,0.3)}
              {this.showCircle(sizeD, this.getShowDataFlag("deaths"), Colors.death,0.7)}
              <text y="2" dy={textOffsetY} fontSize={stateIDFontSize} textAnchor="middle">
                {curid}
              </text>
            </Marker>
) : (
<Annotation
              subject={centroid}
              dx={offsets[curid][0]}
              dy={offsets[curid][1]}
            >
              {this.showCircle(sizeC, this.getShowDataFlag("positives"), Colors.positive,0.6)}
              {this.showCircle(sizeH, this.getShowDataFlag("hospitalized"), Colors.hospitalized,0.3)}
              {this.showCircle(sizeD, this.getShowDataFlag("deaths"), Colors.death,0.7)}
              <text y="2" dy={textOffsetY} fontSize={stateIDFontSize} textAnchor="middle">
                {curid}
              </text>
            </Annotation>
          ))}
      </g>
    );
  }

  getStateColor(geo){
    var element = this.allData[geo.id];
    if(element === undefined || this.getShowDataFlag("tests") === false){
      return '#f7f7f7'
    }
    return element.testColor
  }

  drawLegendCircle(){
    if(!this.getShowDataFlag("positives") && !this.getShowDataFlag("hospitalized") && !this.getShowDataFlag("deaths"))
    {
      return
    }
    var people = 1000
    var sizeT = radiusPerUnit * Math.sqrt(people/unitSize)
    var sY = this.legendY - 15
    var sX = this.legendX + sizeT
    return (
      <g className='recharts-cartesian-axis' style={{fontSize: '0.6rem', fill:'gray'}}>
      <circle cx={sX} cy={sY} r={sizeT} stroke={Colors.mapBorder} strokeWidth="2" fill="none"/>)
      <text x={sX + sizeT*1.5} y={sY} dominantBaseline="central" textAnchor="left">
      {Number(people).toLocaleString()}
      </text>   
      </g>
      )
  }
  
  drawLegendTests(){
    if(! this.getShowDataFlag("tests")){
      return
    }
    var sX = this.legendX
    var sY = this.legendY
    const testingGradientColor="url(#testingColor)"
    const color=this.summary.maxTestsColor
    return(
      <g className='recharts-cartesian-axis' style={{fontSize: '0.6rem', fill:'gray'}}>
      <defs>
          <linearGradient id="testingColor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity={1}/>
          <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
      </defs>
      <text x={sX+85} y={sY+13} dominantBaseline="central" textAnchor="left">
      @ 1 Mil
      </text>   
      <text x={sX} y={sY+25} dominantBaseline="central" textAnchor="left">
      {Number(this.summary.maxTestsScale).toLocaleString()}
      </text>   
      <text x={sX+80} y={sY+25} dominantBaseline="central" textAnchor="middle">0</text> 
      <rect width="80" height="10" x={sX} y={sY + 8} fillOpacity={1} fill={testingGradientColor} strokeWidth="1" stroke='lightgray'/>
      </g>
    )
  }
  render() {
    return (
      <div>
      <p style={{paddingBottom:'2px'}}/>

      <svg width={this.width} height={this.height}>
      <ComposableMap data-tip=""  projection="geoAlbersUsa">
        <Geographies geography={this.statesGeo}>
          {({ geographies }) => (
            <>
              {geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: this.getStateColor(geo),
                      stroke:Colors.mapBorder,
                      strokeWidth: 0.75,
                      outline: 'none'
                    }
                  }}
                  />
              ))}
              {geographies.map(geo=>(this.stateNamesFunc(geo)))}
              {this.drawLegendCircle()}
              {this.drawLegendTests()}
              {geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    this.setState({tooltipContent:geo.id})
                  }}
                  onMouseLeave={() => {
                    this.setState({tooltipContent:""});
                  }}
                  style={{
                    default: {
                      fillOpacity:0,
                      outline: 'none'
                    },
                    hover: {
                      fill: Colors.mapDefault,
                      stroke: Colors.mapBorder,
                      fillOpacity:0.3,
                      strokeWidth: 0.75,
                      outline: 'none'
                    },
                    pressed: {
                      fill: Colors.mapDefault,
                      stroke: Colors.mapBorder,
                      strokeWidth: 0.75,
                      outline: 'none'
                    },

                  }}
                  />
              ))}

            </>
          )}
        </Geographies>
      </ComposableMap>
      </svg>
                <ReactTooltip
                textColor='black'
                backgroundColor='white'
                borderColor = 'gray'
                border = {true}
                >{this.getTooltipContent(this.state.tooltipContent)}</ReactTooltip>
      </div>
    );
  }
};

export default MapChart;
