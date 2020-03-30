import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";
import statesGeo from "./states-10m.json";

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
const radiusPerUnit = 1;
const unitSize = 10;

export function  updateTests(data){
  this.setState({showFlags:this.setUIFlags(data)})  
}

class MapChart extends React.Component {

  constructor(props){
    super(props);
    this.allData = props.data

    this.state={
      showFlags:this.setUIFlags(props.showFlags)
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
    var sizeT=(element? element.tested:0)
    var sizeH=(element? element.hospitalized:0)
    var sizeD=(element? element.deaths:0)

    sizeC = radiusPerUnit * Math.sqrt(sizeC/unitSize)
    sizeT = radiusPerUnit * Math.sqrt(sizeT/unitSize)
    sizeH = radiusPerUnit * Math.sqrt(sizeH/unitSize)
    sizeD = radiusPerUnit * Math.sqrt(sizeD/unitSize)

    return (
      <g key={geo.rsmKey + "-name"}>
        {
          centroid[0] > -160 &&
          centroid[0] < -67 &&
          (Object.keys(offsets).indexOf(curid) === -1 ? (
            <Marker coordinates={centroid}>
              {this.showCircle(sizeT, this.getShowDataFlag("tests"), "#000000",0.15)}
              {this.showCircle(sizeC, this.getShowDataFlag("positives"), "#F53",0.7)}
              {this.showCircle(sizeH, this.getShowDataFlag("hospitalized"), "#0000CC",0.2)}
              {this.showCircle(sizeD, this.getShowDataFlag("deaths"), "#832707",0.5)}
              <text y="2" fontSize={stateIDFontSize} textAnchor="middle">
                {curid}
              </text>
            </Marker>
) : (
<Annotation
              subject={centroid}
              dx={offsets[curid][0]}
              dy={offsets[curid][1]}
            >
              {this.showCircle(sizeT, this.getShowDataFlag("tests"), "#000000",0.15)}
              {this.showCircle(sizeC, this.getShowDataFlag("positives"), "#F53",0.7)}
              {this.showCircle(sizeH, this.getShowDataFlag("hospitalized"), "#0000CC",0.2)}
              {this.showCircle(sizeD, this.getShowDataFlag("deaths"), "#832707",0.5)}
              <text x={4} fontSize={stateIDFontSize} alignmentBaseline="middle">
                {curid}
              </text>
            </Annotation>
          ))}
      </g>
    );
  }
   
  render() {
    return (
      <svg width={1200} height={760}>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={statesGeo}>
          {({ geographies }) => (
            <>
              {geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: '#f7f7f7',
                      stroke: '#607D8B',
                      strokeWidth: 0.75,
                      outline: 'none'
                    },
                    hover: {
                      fill: '#f7f7f7',
                      stroke: '#607D8B',
                      strokeWidth: 0.75,
                      outline: 'none'
                    }
                  }}
                  />
              ))}
              {geographies.map(geo=>(this.stateNamesFunc(geo)))}
            </>
          )}
        </Geographies>
      </ComposableMap>
      </svg>
    );
  }
};

export default MapChart;
