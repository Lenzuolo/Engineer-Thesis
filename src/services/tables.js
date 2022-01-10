import { signalLabels } from '../utils';

function edgeDetector(arg1,arg2)
{
    if(arg1.y === 0 && arg2.y === 1)
    {
        return {detected: true, type:'rising'}
    }
    else if(arg1.y === 1 && arg2.y === 0)
    {
        return {detected: true, type: 'falling'}
    }
    else return {detected: false, type: ''};
}

function isNotConflictingState(part,nextPartEnd,state,notConfArray){
    const existingState = notConfArray.find(s => s.value === state.NSU);
    if(typeof existingState !== 'undefined'){
        const tacts = existingState.tacts;
        const sliced = part.slice(0,part.indexOf(state));
        for(let i = 0; i < tacts.length; i++){
            if((sliced.some(p=>p.tact === tacts[i]) && tacts[i] !== state.tact) && tacts[i] !== nextPartEnd){
                return true;
            }
        }
    }
    return false;
}



function isAnotherConflict(state,nextPartEnd,confArray,firstBorder){
    let existingStates = [];
    confArray.forEach(c =>{
        if(c.value === state.NSU){
            if(c.tacts.some(t=> t === state.tact)){
                if(c.tacts.some(t=>t > state.tact && t <= nextPartEnd)){
                    existingStates.push(c);
                }
                else
                {
                    if(firstBorder)
                    {
                        existingStates.push(c);
                    }
                }
            }
        }
    });
    
    return existingStates.length > 0;
    
}

function isStateInPart(tact,part)
{
    for(let i = 0; i<part.length;i++)
    {
        if(part[i].tact === tact)
        {
            return true;
        }
    }
}

function whichStateComesFirst(tacts,part)
{
    for(let i = 0; i < part.length; i++)
    {
        if(part[i].tact === tacts[0])
        {
            return {first: tacts[0],second:tacts[1]};
        }
        else if(part[i].tact === tacts[1])
        {
            return {first: tacts[1], second: tacts[0]};
        }
    }
}

function findNsuIndex(tact,nsuArray)
{
    for(let i = 0; i < nsuArray.length; i++)
    {
        if(nsuArray[i].tact === tact)
        {
            return i;
        }
    }
}

function isConflictingPair(state1,state2,confArray)
{
    for(let i = 0; i < confArray.length; i++)
    {
        const confState = confArray[i];
        if(confState.value === state1.NSU && confState.value === state2.NSU)
        {
            if(confState.tacts.includes(state1.tact) && confState.tacts.includes(state2.tact))
            {
                return true;
            }
        }
    }
    return false;
}

function checkParts(part1,part2,confArray)
{
    if(part1.length === 1 && part2.length === 1)
    {
        return false;
    }

    if(part1.length > part2.length)
    {
        for(let i = 0; i < part1.length; i++)
        {
            for(let j = 0; j < part2.length; j++)
            {
                if(part1[i].NSU === part2[j].NSU)
                {
                    if(isConflictingPair(part1[i],part2[j],confArray))
                    {
                        return false;
                    }
                    else
                    {
                        if(i === part1.length-1 && j === part2.length-1)
                        {
                            return true;
                        }
                    }
                }
            }
        }
    }
    else
    {
        for(let i = 0; i < part2.length; i++)
        {
            for(let j = 0; j < part1.length; j++)
            {
                if(part2[i].NSU === part1[j].NSU)
                {
                    if(isConflictingPair(part1[j],part2[i],confArray))
                    {
                        return false;
                    }
                    else
                    {
                        if(i === part2.length-1 && j === part1.length-1)
                        {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function partCount(indexedParts)
{
    let indices = [];

    indexedParts.forEach(i =>
        {
            if(!indices.includes(i.index))
            {
                indices.push(i.index);
            }
        });

    return {indices:indices};
}

class TableService
{
    static calculateTacts(inArray,outArray,length)
    {
        let tact = 1;
        let dependencyArray = [];

        for(let i = 0; i < length-1; i++)
        {
            let signalIn = {label: '', type: ''};
            let signalOut = {label: '',type: ''};
            for(let j = 0; j<inArray.length;j++){
                const data = inArray[j].data;
                const { detected, type } = edgeDetector(data[i],data[i+1]);
                if(detected){
                    signalIn = {label: inArray[j].label, type: type};
                    break;
                }
            }
            if(signalIn.label !== ''){
                for(let j = 0; j < outArray.length;j++){
                    const data = outArray[j].data;
                    const { detected, type } = edgeDetector(data[i],data[i+1]);
                    if(detected){
                        signalOut = {label: outArray[j].label, type: type};
                        break;
                    }
                }
                dependencyArray.push({tact: tact,label: signalIn.label, type:signalIn.type});
                if(signalOut.label !== ''){
                    dependencyArray.push({tact: tact+1, label: signalOut.label, type: signalOut.type});
                    tact+=2;
                }
                else{
                    tact++;
                }
            }
        }

        return {tacts: tact-1, dependencies: dependencyArray}


    }
    static calculateNSU(dependencies,signals){

        let nsuArray = [{tact:0,NSU:0}];
        let NSU = 0;
        for(let i = 0; i < dependencies.length; i++){
            for(let j = 0; j < signals.length;j++){
                if(signals[j].label === dependencies[i].label){
                    if(dependencies[i].type === 'rising')
                    {
                        NSU += Math.pow(2,j);
                        break;
                    }
                    else if(dependencies[i].type === 'falling')
                    {
                        NSU -= Math.pow(2,j);
                        break;
                    }
                }
            }
            nsuArray.push({tact: dependencies[i].tact, NSU: NSU});
        }

        if(dependencies[dependencies.length-1].type==='falling'){
             nsuArray.pop();
        }

        return nsuArray;
    }

    static calculateConditions(label,dependencyArray,nsuArray){
 
        let workingConditions = [];
        let notWorkingConditions = [...nsuArray];
        let start = null,end = null;

        for(let i = 0; i < dependencyArray.length; i++){
            if(label === dependencyArray[i].label){
                if(dependencyArray[i].type === 'rising'){
                    start = dependencyArray[i].tact;
                }
                else if(dependencyArray[i].type === 'falling'){
                    end = i === dependencyArray.length-1 ? dependencyArray[i].tact-1 : dependencyArray[i].tact;
                }
                if(start !== null && end !== null){
                    
                    let startOffset = start > 0.5 ? 1 : 0;
                    let endOffset = i === dependencyArray.length-1 ? 0 : 1;
                    let sliced = nsuArray.slice(findNsuIndex(start,nsuArray)-startOffset,findNsuIndex(end,nsuArray)-endOffset);
                    workingConditions = workingConditions.concat(sliced);
                    start = null;
                    end = null;
                }
            }
        }

        notWorkingConditions = notWorkingConditions.filter(nwc => !workingConditions.includes(nwc));

        return { workingConditions: workingConditions, notWorkingConditions: notWorkingConditions, label: label};
    }

    static findBorders(nsuArray,conflictingStates,notConflictingStates){
        
        let solved = false;
        let endOfCycle = false;
        let reduction = false;
        let doubleBorderProcedure = {isNeeded:false, firstBorder: {set: false, index: -1}};
        let currentPart;
        let index = 0;
        let offset = 1;
        let borders = [];
        let arr = [...conflictingStates];
        let stack = [[...nsuArray]];
        while(!solved)
        {
            if(reduction)
            {
                if(borders.length > 2)
                {
                    let toReduce = [];
                    let mergeIndices = [];
                    let reducable = true;
                    stack.forEach((p,i)=>{
                        if(p.some(s=>s.tact === borders[0] || s.tact === borders[0]+1))
                        {
                            if(p.length !== 1)
                            {
                                mergeIndices.push(i);
                                toReduce = toReduce.concat(p);
                            }
                            else
                            {
                                reducable = false;
                            }
                        }
                    });

                    for(let i = 0; i < conflictingStates.length;i++)
                    {
                        if(isStateInPart(conflictingStates[i].tacts[0],toReduce) && 
                            isStateInPart(conflictingStates[i].tacts[1],toReduce))
                        {
                            reducable = false;
                            break;
                        }
                    }

                    if(reducable)
                    {
                        borders.shift();
                        stack.splice(mergeIndices[0],mergeIndices.length,toReduce);
                    }
                }
                else{
                    if(stack.length>2){
                        stack.shift();
                    }
                }
                solved = true;
            }
            else
            {
                let state = arr[index];
                if(!doubleBorderProcedure.isNeeded)
                {
                    currentPart = stack[stack.length-1];
                }
                if(!isStateInPart(state.tacts[0],currentPart) ||
                    !isStateInPart(state.tacts[1],currentPart))
                {
                    index++;
                        if(index >= conflictingStates.length)
                        { 
                           if(currentPart[currentPart.length-1].tact === nsuArray[nsuArray.length-1].tact)
                           {
                                if(!endOfCycle)
                                {
                                    endOfCycle = true;
                                    const merged = currentPart.concat([...stack[0]]);
                                    stack.shift();
                                    stack.splice(stack.length-1,1,merged);
                                    index = 0;
                                }
                            }
                            else
                            {
                                if(endOfCycle)
                                {
                                    reduction = true;
                                }
                                index = 0;
                            }
                        }
                }
                else
                {
                    let {first,second} = whichStateComesFirst(state.tacts,currentPart);
                    let tact = second - offset;
                    let nsuVal = currentPart.find(n=>n.tact === tact);
                    let nextPartEnd = currentPart[currentPart.length-1].tact;
                    if(doubleBorderProcedure.isNeeded)
                    {
                        if(isNotConflictingState(currentPart,nextPartEnd,
                            nsuVal,notConflictingStates) || isAnotherConflict(nsuVal,nextPartEnd,conflictingStates,true))
                            {
                                borders.push(tact);
                                if(!doubleBorderProcedure.firstBorder.set)
                                {
                                    doubleBorderProcedure.firstBorder.set = true;
                                    doubleBorderProcedure.firstBorder.index = currentPart.indexOf(nsuVal)+1;
                                    offset++;
                                }
                                else
                                {
                                    const partIndex = stack.indexOf(currentPart);
                                    const firstPart = currentPart.slice(0,currentPart.indexOf(nsuVal)+1);
                                    const secondPart = currentPart.slice(currentPart.indexOf(nsuVal)+1,
                                        doubleBorderProcedure.firstBorder.index);
                                    const thirdPart = currentPart.slice(doubleBorderProcedure.firstBorder.index);
                                    stack.splice(partIndex,1,firstPart,secondPart,thirdPart);
                                    doubleBorderProcedure = {isNeeded: false, firstBorder: {set:false,index:-1}};
                                    offset = 1;
                                    index = 0;
                                }
                            }
                    }
                    else
                    {
                        if(!isNotConflictingState(currentPart,nextPartEnd,
                            nsuVal,notConflictingStates) && !isAnotherConflict(nsuVal,nextPartEnd,conflictingStates,borders.length===0)){
                            borders.push(tact);
                            offset = 1;
                            const firstPart = currentPart.slice(0, currentPart.indexOf(nsuVal)+1)
                            const secondPart = currentPart.slice(currentPart.indexOf(nsuVal)+1);
                            stack.splice(stack.indexOf(currentPart),1,firstPart,secondPart);
                            if(endOfCycle){
                                reduction = true;
                                endOfCycle = false;
                            }
                            index = 0;
                        }
                        else{
                            offset++;
                            if(currentPart.findIndex(a=>a.tact === second-offset) < currentPart.findIndex(a=>a.tact === first))
                            {
                                doubleBorderProcedure.isNeeded = true;
                                offset = 1;
                            }
                        }
                    }
                }
            }
        }

        borders.sort((a,b)=>a-b);

        stack.sort((a,b) => 
            a[a.length-1].tact - b[b.length-1].tact);

        return {borders,stack};
    }

   static codeSignals(borders,parts,dependencies,{conflictingStates})
   {
       let newDependencies = [...dependencies];
       let useOneSignal = borders.length === 2;

       if(useOneSignal)
       {
            newDependencies.push({tact: borders[0]+0.5,label: 'Z0',type:'rising'});
            newDependencies.push({tact: borders[1]+0.5,label: 'Z0',type:'falling'});
            newDependencies.sort((a,b) => a.tact - b.tact);
            return {dependencies:newDependencies,tacts:newDependencies.length,labels:[{label:'Z0'}]};
       }
       else{
            const indexedParts = parts.map((p,i)=> ({index:i+1,part: p}));

            for(let i = 0; i < indexedParts.length; i++)
            {
                if(i+2 < indexedParts.length)
                {
                    if(checkParts(indexedParts[i].part,indexedParts[i+2].part,conflictingStates))
                    {
                        indexedParts[i+2].index = indexedParts[i].index;
                    }
                }
            }

            const {indices} = partCount(indexedParts);

            let signalAmount = indices.length > 2 ? Math.ceil(Math.sqrt(indices.length)) : 1;
            useOneSignal = signalAmount === 1;
            let count = 0;
            let signals = [];
            signalLabels('additional',signalAmount).forEach(s=>signals.push({label:s,working:false}));
            let signalFlag = false;
            indexedParts.forEach(i=>
                {
                    let allSignalsOn = signals.every(s=>s.working === true);
                    if(allSignalsOn)
                    {
                        signalFlag = true;
                    }
                    let signal = signalFlag ? signals.find(s=>s.working) : signals.find(s=>!s.working);
                    newDependencies.push({tact: i.part[i.part.length-1].tact+0.5,label: signal.label,
                        type: signal.working ? 'falling' : 'rising'});
                    signal.working = !signal.working;
                    count++;
                    if(useOneSignal)
                    {
                        if(count >= 2)
                        {
                            count = 0;
                            signalFlag = false;
                        }
                    }
                });
            newDependencies.sort((a,b)=> a.tact - b.tact);
            return {dependencies: newDependencies,tacts: newDependencies.length,labels:signals}
       }
   }

}

export default TableService;