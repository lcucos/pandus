
function getBucketLimits(value, startAt){
        //var startAt=this.groupingInfo.startAt
        if(value<startAt){
            return {start:0,stop:startAt}
        }
        var crtVal=startAt
        var preVal=0
        for(var i=startAt;i<100000;i++){            
            if(value<crtVal){
                return {
                    start:preVal,
                    stop:crtVal
                }
            }
            preVal=crtVal
            crtVal = crtVal*2
        }
}

export function exponentialClustering(statesSummary, sortBy){
    statesSummary.sort(function(a,b){
          return a[sortBy] > b[sortBy] ? -1 : 1;
      });
    const startAt=10
    //console.dir(statesSummary)
    var arrOut=[]
    var arrTmp=[]
    var bucket = getBucketLimits(statesSummary[0][sortBy],startAt)
    arrOut.push({
        arrData:arrTmp,
        bucket:bucket
    })
    arrTmp.push(statesSummary[0].stateCode)
    
    for(var i=1;i<statesSummary.length;i++){
        if(bucket.start > statesSummary[i][sortBy]){
            arrTmp=[]
            bucket = getBucketLimits(statesSummary[i][sortBy],startAt)
            arrOut.push({
                arrData:arrTmp,
                bucket:bucket
            })
        }
        arrTmp.push(statesSummary[i].stateCode)
        
    }
    //console.dir(arrOut)
    return arrOut
 }