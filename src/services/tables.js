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
function isNotConflictingState(part,nextPartEnd,state,notConfArray,prevPartEnd){

    const existingState = notConfArray.find(s => s.value === state.NSU);
    if(typeof existingState !== 'undefined'){
        const tacts = existingState.tacts;
        const sliced = part.slice(0,part.indexOf(state));
        for(let i = 0; i < tacts.length; i++){
            if((sliced.some(p=>p.tact === tacts[i]) && tacts[i] !== state.tact)){
                return true;
            }
            else if(tacts[i] === nextPartEnd)
            {
                return true;
            }
            else if(tacts[i] === prevPartEnd)
            {
                return true;
            }
        }
    }
    return false;
}
function equalsStartState(dependencyArray,state)
{
    const arr = dependencyArray.filter(da => da.tact === 0);

    const elem = arr.find(s => s.label === state.label && s.type === state.type);
    if(typeof elem !== 'undefined')
    {
        return true;
    }
    else
    {
        if(state.type === 'falling')
        {
            return true;
        }
    }
    return false;
}
function isAnotherConflict(state,nextPartEnd,currentPart,confArray,firstBorder){
    let existingStates = [];
    confArray.forEach(c =>{
        if(c.value === state.NSU){
            if(c.tacts.some(t=> t === state.tact)){
                if(c.tacts.some(t=>{
                    let indexOfTact = currentPart.findIndex(s=>s.tact === t);
                    let indexOfStart = currentPart.findIndex(s=>s.tact === state.tact);
                    let indexOfEnd = currentPart.findIndex(s=>s.tact === nextPartEnd);
                    return indexOfTact > indexOfStart && indexOfTact <= indexOfEnd
                }))
                {
                    existingStates.push(c);
                }
                else
                {
                    const filtered = currentPart.slice(0,currentPart.indexOf(state));
                    if(filtered.some(s=>s.NSU === state.NSU && c.tacts.includes(s.tact)))
                    {
                        existingStates.push(c);
                    }
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
    if(part1.length === 1 
        || part2.length === 1)
    {
        return {canMerge:false};
    }

        for(let i = 0; i < part1.length; i++)
        {
            for(let j = 0; j < part2.length; j++)
            {
                if(part1[i].NSU === part2[j].NSU)
                {
                    if(isConflictingPair(part1[i],part2[j],confArray))
                    {
                        return {canMerge:false};
                    }
                    else
                    {
                        if(i === part1.length-1 && j === part2.length-1)
                        {
                            return {canMerge:true,specialCondition:true};
                        }
                    }
                }
            }
        }
    return {canMerge:true,specialCondition:false};
}
function partCount(indexedParts)
{
    let indices = [];
    let original = [];
    let repeats = [];
    indexedParts.forEach(i =>
        {
            original.push(i.index);
            if(!indices.includes(i.index))
            {
                indices.push(i.index);
            }
            else
            {
                repeats.push(i.index);
            }
        });

    return {indices:indices,repeats};
}
function updateCodedSignals(signal,signals)
{
    const filtered = signals.filter(s=>s.label !== signal.label);

    filtered.forEach(s=>{
        s.working ? s.signalChanges.push('+') : s.signalChanges.push('-');
    });

    return;
}
function createState(signals){
    let state = [];
    signals.forEach(s=>state.push({label:s.label,working:s.working}));
    return state;
}
function whichSignalIsDifferent(prevState,state)
{
    for(let i = 0; i < state.states.length;i++)
    {
        if(prevState.states[i].working !== state.states[i].working){
            return state.states[i].label;
        }
    }
}
function checkPartForProblems(part,index,conflictingStates){
    
    const lastElem = part[part.length-1];
    const sliced = part.slice(0,part.length-1);

    for(let i = 0; i<sliced.length;i++)
    {
        if(sliced[i].NSU === lastElem.NSU){
            return { isWrong:true, bordersAmount: 2, index};
        }
    }

    for(let i = 0;i<conflictingStates.length;i++)
    {
        if(isStateInPart(conflictingStates[i].tacts[0],part) && isStateInPart(conflictingStates[i].tacts[1],part)){
            return { isWrong: true, bordersAmount: 2, index};
        }
    }

    return { isWrong: false, bordersAmount: 0};
}
function sameIndexParts(parts,confArray)
{
    let canMerge = true;
    let specialCondition = false;
    for(let i = 0; i<parts.length;i++){
        for(let j = i+1;j < parts.length;j++){
            const check = checkParts(parts[i].part,parts[j].part,confArray);
            if(!check.canMerge){
                canMerge = false;
                break;
            }
            else
            {
                specialCondition = check.specialCondition;
            }
        }
    }
    if(canMerge){
        parts.forEach(p=>p.index = parts[0].index);
    }
    return {parts,canMerge,specialCondition};
}
function reductionStage(additionalBorderProcedure,borders,stack,conflictingStates)
{
    let toReduce = [];
    let mergeIndices = [];
    let reducable = true;

    stack.sort((a,b)=>a[a.length-1].tact-b[b.length-1].tact);
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

    let problems = mergeIndices.length <= 1 ? { isWrong:true } :
        checkPartForProblems(toReduce,mergeIndices[0],conflictingStates);

    reducable = problems.isWrong ? false : true;

    if(reducable)
    {
        borders.shift();
        stack.splice(mergeIndices[0],mergeIndices.length,toReduce);
    }
    else
    {
        if(borders.length % 2 !== 0)
        {
            additionalBorderProcedure.isNeeded = true;
            let length = 0;
            stack.forEach((p,i)=>
            {
                if(p.length >= length)
                {
                    length = p.length;
                    additionalBorderProcedure.stackIndex = i;
                }
            })
        }
        else{
            for(let i = 0; i < stack.length;i++)
            {
                const {isWrong,index,bordersAmount} = checkPartForProblems(stack[i],i,conflictingStates);
                if(isWrong){
                    additionalBorderProcedure.stackIndex = index;
                    additionalBorderProcedure.bordersAmount = bordersAmount;
                    additionalBorderProcedure.isNeeded = true;
                    break;
                }
            }
        }
    }
}
function additionalBorderStage(additionalBorderProcedure,stack,currentPart,borders,notConflictingStates,conflictingStates)
{
    // eslint-disable-next-line no-debugger
    debugger;
    let prevPartEnd;
    let prevPart;
    if(additionalBorderProcedure.stackIndex === 0)
    {
         prevPart = stack[stack.length-1];
        if(additionalBorderProcedure.bordersAmount !== 2)
            prevPartEnd = prevPart[prevPart.length-1].tact;
    }
    else
    {
        prevPart = stack[additionalBorderProcedure.stackIndex-1];
        if(additionalBorderProcedure.bordersAmount !== 2)
            prevPartEnd = prevPart[prevPart.length-1].tact;
    }
    let nextPartEnd = currentPart[currentPart.length-1].tact;
    for(let i = currentPart.length-2;i>=0;i--)
    {
        if(!borders.includes(currentPart[i].tact))
        {
            if((!isNotConflictingState(currentPart,nextPartEnd,currentPart[i],notConflictingStates,prevPartEnd) &&
                !isAnotherConflict(currentPart[i],nextPartEnd,currentPart,conflictingStates,false) &&
                    !currentPart.slice(0,i+1).find(f=>f.NSU === prevPart[prevPart.length-1].NSU)) || 
                        additionalBorderProcedure.doubleBorder)
                {
                    borders.push(currentPart[i].tact);
                    additionalBorderProcedure.borderAdded = true;
                    additionalBorderProcedure.bordersAmount--;
                    const firstPart = currentPart.slice(0, i+1)
                    const secondPart = currentPart.slice(i+1);
                    stack.splice(stack.indexOf(currentPart),1,firstPart,secondPart);
                    if(additionalBorderProcedure.bordersAmount > 0){
                        additionalBorderProcedure.stackIndex = stack.indexOf(firstPart);
                    }
                    break;
                }
        }
    }
    if(additionalBorderProcedure.borderAdded)
    {
        additionalBorderProcedure.borderAdded = false;
        if(additionalBorderProcedure.bordersAmount === 0)
        {
            additionalBorderProcedure.isNeeded = false;
            for(let i = 0; i < stack.length;i++)
            {
                const {isWrong,index,bordersAmount} = checkPartForProblems(stack[i],i,conflictingStates);
                if(isWrong){
                    additionalBorderProcedure.stackIndex = index;
                    additionalBorderProcedure.bordersAmount = bordersAmount;
                    additionalBorderProcedure.isNeeded = true;
                    break;
                }
            }
        }
    }
    else
    {
        const {isWrong} = checkPartForProblems(currentPart,additionalBorderProcedure.stackIndex,conflictingStates);
        isWrong ? additionalBorderProcedure.doubleBorder = true : additionalBorderProcedure.stackIndex++;
    }
}
function doubleBorderStage(doubleBorderProcedure,currentPart,stack,stateProps,indices,borders,flags)
{
    if(!doubleBorderProcedure.firstBorder.set)
    {
        borders.push(stateProps.nsuVal.tact);
        doubleBorderProcedure.firstBorder.set = true;
        doubleBorderProcedure.firstBorder.index = currentPart.indexOf(stateProps.nsuVal)+1;
        doubleBorderProcedure.firstBorder.tact = stateProps.nsuVal.tact;
        if(stateProps.second-indices.offset > 0)
        {
            indices.offset++;
        }
        else
        {
            flags.mergeEndProcedure = true;
            indices.offset = 1;
        }
    }
    else
    {
        if(stateProps.first === stateProps.nsuVal.tact)
        {
            borders.push(stateProps.nsuVal.tact);
            const partIndex = stack.indexOf(currentPart);
            const firstPart = currentPart.slice(0,currentPart.indexOf(stateProps.nsuVal)+1);
            const secondPart = currentPart.slice(currentPart.indexOf(stateProps.nsuVal)+1,
                doubleBorderProcedure.firstBorder.index);
            const thirdPart = currentPart.slice(doubleBorderProcedure.firstBorder.index);
            stack.splice(partIndex,1,firstPart,secondPart,thirdPart);
            doubleBorderProcedure.isNeeded = false; 
            doubleBorderProcedure.firstBorder = {set:false,index:-1,tact:-1};
            if(flags.endOfCycle)
            {
                flags.mergeEndProcedure = false;
                flags.reduction = true;
                flags.endOfCycle = false;
            }
            indices.offset = 1;
        }
        else
        {
            if(stateProps.second-indices.offset > 0)
            {
                indices.offset++;
            }
            else
            {
                if(!flags.mergeEndProcedure)
                {
                    flags.mergeEndProcedure = true;
                    indices.offset = 1;
                    return;
                }
                indices.offset++;
            }
        }
    }
}

function borderControl(doubleBorderProcedure,currentPart,stack,nsuArray,stateProps,indices,stateLists,borders,flags){
    if(!isNotConflictingState(currentPart,stateProps.nextPartEnd,
        stateProps.nsuVal,stateLists.notConflictingStates,stateProps.prevPartEnd) && 
            !isAnotherConflict(stateProps.nsuVal,stateProps.nextPartEnd,currentPart,stateLists.conflictingStates,borders.length===0))
        {
            borders.push(stateProps.nsuVal.tact);
            indices.offset = 1;
            const firstPart = currentPart.slice(0, currentPart.indexOf(stateProps.nsuVal)+1)
            const secondPart = currentPart.slice(currentPart.indexOf(stateProps.nsuVal)+1);
            stack.splice(stack.indexOf(currentPart),1,firstPart,secondPart);
            if(flags.endOfCycle){
                flags.mergeEndProcedure = false;
                flags.reduction = true;
                flags.endOfCycle = false;
            }
        }
        else
        {
            indices.offset++;
            if(stateProps.second-indices.offset >= 0)
            {
                if(currentPart.findIndex(a=>a.tact === stateProps.second-indices.offset) 
                    <= currentPart.findIndex(a=>a.tact === stateProps.first))
                {
                    doubleBorderProcedure.isNeeded = true;
                    indices.offset = 1;
                }
            }
            else
            {
                if(flags.endOfCycle)
                {
                    indices.offset--;
                    if(currentPart.findIndex(a=>a.tact === nsuArray[nsuArray.length-1].tact-indices.offset) 
                        <= currentPart.findIndex(a=>a.tact === stateProps.first))
                    {
                        indices.offset = 1;
                        doubleBorderProcedure.isNeeded = true;
                        flags.mergeEndProcedure = false;
                        return;
                    }
                    else
                    {
                        if(!flags.mergeEndProcedure)
                        {
                            flags.mergeEndProcedure = true;
                            indices.offset = 1;
                            return;
                        }
                    }
                    indices.offset++;
                }
            }
        }
}
function findNearestState(conflictingStates,currentPart)
{
    let allStatesInPart = [];

    conflictingStates.forEach(c=>{
        if(isStateInPart(c.tacts[0],currentPart) && isStateInPart(c.tacts[1],currentPart))
        {
            allStatesInPart.push(c);
        }
    });

    let difference = currentPart.length;
    let state;

    allStatesInPart.forEach(s=>
        {
            let diff = Math.abs(currentPart.findIndex(c=>c.tact === s.tacts[0])-currentPart.findIndex(c=>c.tact === s.tacts[1]));
            if(diff < difference )
            {
                if(state)
                {
                    const currStateOrder = whichStateComesFirst(state.tacts,currentPart);
                    const thisStateOrder = whichStateComesFirst(s.tacts,currentPart);
                    if(currentPart.findIndex(c=>c.tact === currStateOrder.second) <= currentPart.findIndex(c=>c.tact === thisStateOrder.second)) return;
                }
                state = s;
                difference = diff;
            }
        });

    return state;
}
function codeParts(odd,even,conflictingStates)
{
    const oddCoded = sameIndexParts(odd,conflictingStates);
    const evenCoded = sameIndexParts(even,conflictingStates);

    if(oddCoded.canMerge && oddCoded.specialCondition)
    {
        if(!evenCoded.canMerge)
        {
            let offset = 1;
            odd.forEach((o,i)=>{
                o.index = i+offset;
                offset++;
            });
        }
    }
    else if(evenCoded.canMerge && evenCoded.specialCondition)
    {
        if(!oddCoded.canMerge)
        {
            let offset = 1;
            even.forEach((e,i)=>{
                e.index = i+offset;
                offset++;
            });
        }
    }

}

class TableService
{
    static calculateTacts(inArray,outArray,length)
    {
        let tact = 1;
        let dependencyArray = [];
        let allSignals = [...inArray,...outArray];

        allSignals.forEach(s=> {
            if(s.data[0].y === 1)
            {
                dependencyArray.push({tact: 0,label: s.label, type:'rising'});
            }
        })

        if(dependencyArray.length === 0)
        {
            dependencyArray.push({tact: 0,label: '', type:''});
        }

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
            let signalsOut = [];
            for(let j = 0; j < outArray.length;j++){
                    const data = outArray[j].data;
                    const { detected, type } = edgeDetector(data[i],data[i+1]);
                    if(detected){
                        signalsOut.push({label: outArray[j].label, type: type});
                    }
            }
            if(signalIn.label !== '')
            {
                dependencyArray.push({tact: tact,label: signalIn.label, type:signalIn.type});
                if(signalsOut.length !== 0){

                    signalsOut.forEach((s,i)=>{
                        dependencyArray.push({tact: tact+1+i, label: s.label, type: s.type});
                    });
                    tact+=signalsOut.length+1;
                }
                else{
                    tact++;
                }
            }
            else
            {
                if(signalOut.label !== '')
                {
                    dependencyArray.push({tact: tact, label: signalOut.label, type: signalOut.type});
                    tact++;
                }
            }
        }
        return {tacts: tact-1, dependencies: dependencyArray}


    }
    static calculateNSU(dependencies,signals){

        let nsuArray = [];

        let NSU = 0;
        let startCount = 0;
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
            if(dependencies[i].tact === 0)
            {
                startCount++;
            }
            nsuArray.push({tact: dependencies[i].tact, NSU: NSU});
        }

        if(startCount > 1)
        {
            nsuArray.splice(0,startCount,{tact:0,NSU:nsuArray[startCount-1].NSU});
        }

        // if(dependencies[dependencies.length-1].type==='falling'){
        //      nsuArray.pop();
        // }

        if(nsuArray[nsuArray.length-1].NSU === nsuArray[0].NSU)
        {
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
                    end = dependencyArray[i].tact;
                }
                if(start !== null)
                {
                    if(end !== null)
                    {
                        let startOffset = start > 0 ? 1 : 0;
                        let endIndex;
                        if(i === dependencyArray.length-1)
                        {
                            if(equalsStartState(dependencyArray,dependencyArray[i]))
                            { 
                                endIndex=nsuArray.length-1;
                            }
                        }
                        else
                        {
                            endIndex = findNsuIndex(end,nsuArray)-1;
                        }
                        let sliced = nsuArray.slice(findNsuIndex(start,nsuArray)-startOffset,endIndex);
                        workingConditions = workingConditions.concat(sliced);
                        start = null;
                        end = null;
                    }
                    else if(end === null && i === dependencyArray.length-1)
                    {
                        let sliced = nsuArray.slice(nsuArray.length-1,nsuArray.length);
                        workingConditions = workingConditions.concat(sliced);
                    }
                }
            }
            else if(i === dependencyArray.length-1)
            {
                if(start !== null && end === null)
                {
                    let startOffset = start > 0 ? 1 : 0;
                    let sliced = nsuArray.slice(findNsuIndex(start,nsuArray)-startOffset,nsuArray.length);
                    workingConditions = workingConditions.concat(sliced);
                }
            }
        }

        notWorkingConditions = notWorkingConditions.filter(nwc => !workingConditions.includes(nwc));

        return { workingConditions: workingConditions, notWorkingConditions: notWorkingConditions, label: label};
    }
    static findBorders(nsuArray,conflictingStates,notConflictingStates){
        let flags = {
            solved:false,
            endOfCycle:false,
            reduction:false,
            mergeEndProcedure: false,

        };
        let procedures = {
            additionalBorderProcedure:{isNeeded: false,bordersAmount: 1, borderAdded: false, stackIndex:0,doubleBorder:false,},
            doubleBorderProcedure:{isNeeded:false, firstBorder: {set: false, index: -1,tact:-1},},
        };
        let currentPart;
        let indices = {offset:1,};
        let borders = [];
        let stack = [[...nsuArray]];
        // eslint-disable-next-line no-debugger
        debugger
        while(!flags.solved)
        {
            if(flags.reduction)
            {
                if(borders.length > 2)
                {
                    reductionStage(procedures.additionalBorderProcedure,borders,stack,conflictingStates);
                }
                else{
                    if(stack.length>2){
                        stack.shift();
                    }
                    for(let i = 0; i < stack.length;i++)
                    {
                        const {isWrong,index,bordersAmount} = checkPartForProblems(stack[i],i,conflictingStates);
                        if(isWrong){
                            procedures.additionalBorderProcedure.stackIndex = index;
                            procedures.additionalBorderProcedure.bordersAmount = bordersAmount;
                            procedures.additionalBorderProcedure.isNeeded = true;
                            break;
                        }
                    }
                }
                flags.reduction = false;
                if(procedures.additionalBorderProcedure.isNeeded === false)
                    flags.solved = true;
            }
            else if(procedures.additionalBorderProcedure.isNeeded)
            {
                currentPart = stack[procedures.additionalBorderProcedure.stackIndex];
                additionalBorderStage(procedures.additionalBorderProcedure,stack,currentPart,borders,notConflictingStates,conflictingStates);
                if(!procedures.additionalBorderProcedure.isNeeded)
                flags.solved = true;
            }
            else
            {
                if(!procedures.doubleBorderProcedure.isNeeded)
                {
                    currentPart = stack[stack.length-1];
                } 
                let state = findNearestState(conflictingStates,currentPart);
                if(typeof state === 'undefined')
                {
                    if(currentPart[currentPart.length-1].tact === nsuArray[nsuArray.length-1].tact)
                    {
                        if(!flags.endOfCycle)
                        {
                            flags.endOfCycle = true;
                            const merged = currentPart.concat([...stack[0]]);
                            stack.shift();
                            stack.splice(stack.length-1,1,merged);
                        }
                    }
                    else
                    {
                        if(flags.endOfCycle)
                        {
                            flags.reduction = true;
                        }
                    }
                }
                else
                {
                    let {first,second} = whichStateComesFirst(state.tacts,currentPart);
                    let prevPartEnd;
                    if(stack.length > 1)
                    {
                        const prevPart = stack[stack.length-2];
                        prevPartEnd = prevPart[prevPart.length-1].tact;
                    }
                    else
                    {
                        currentPart[0] === nsuArray[0] ? prevPartEnd=nsuArray[0].tact : prevPartEnd=currentPart[currentPart.length-1].tact;
                    }
                    let tact = (flags.mergeEndProcedure || second-indices.offset < 0) ? 
                        nsuArray[nsuArray.length-indices.offset].tact : second - indices.offset;
                    let nextPartEnd = procedures.doubleBorderProcedure.firstBorder.set ? 
                        procedures.doubleBorderProcedure.firstBorder.tact : 
                            (stack.length > 1 ? stack[0][stack[0].length-1].tact : currentPart[currentPart.length-1].tact);
                    let nsuVal = currentPart.find(n=>n.tact === tact);

                    let stateProps = {
                        first,
                        second,
                        prevPartEnd,
                        nextPartEnd,
                        nsuVal,
                    }

                    if(procedures.doubleBorderProcedure.isNeeded)
                    {
                        doubleBorderStage(procedures.doubleBorderProcedure,currentPart,stack,
                            stateProps,indices,borders,flags);
                    }
                    else
                    {
                        borderControl(procedures.doubleBorderProcedure,currentPart,stack,nsuArray,
                            stateProps,indices,{conflictingStates,notConflictingStates},borders,flags);
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
            return {dependencies:newDependencies,tacts:newDependencies.length,labels:[{label:'Z0',signalChanges:['-','+','-']}],indices:[1,2]};
       }
       else{
            const indexedParts = parts.map((p,i)=> ({index:i+1,part: p}));

            // eslint-disable-next-line no-debugger
            debugger;
            // for(let i = 0; i < indexedParts.length; i++)
            // {
            //     const filtered = indexedParts.filter((_,j)=> j % 2 === i % 2);
            //     sameIndexParts(filtered,conflictingStates);
            // }

            const odd = indexedParts.filter((p)=> p.index % 2 === 1);
            const even = indexedParts.filter((p)=> p.index % 2 === 0);

            codeParts(odd,even,conflictingStates);

            const {indices} = partCount(indexedParts);

            let signalAmount = indices.length > 2 ? Math.ceil(indices.length/2) : 1;
            let signals = [];
            signalLabels('additional',signalAmount).forEach((s)=>{
                    signals.push({label:s,working:false,signalChanges:['-']});
            });
            let signalFlag = false;
            let states = [];
            indexedParts.forEach((i,j)=>
                {
                    let allSignalsOn = signals.every(s=>s.working === true);
                    if(allSignalsOn)
                    {
                        signalFlag = true;
                    }
                    else{
                        if(signals.every(s=>!s.working)){
                            signalFlag = false;
                        }
                    }
                    const state = states.find(s=>s.index === i.index);
                    if(typeof state === 'undefined')
                    {
                        let nextState = j===indexedParts.length-1 ? states.find(s=>s.index === indexedParts[0].index):states.find(s=>s.index === indexedParts[j+1].index);
                        let signal;
                        states.push({index: i.index,states:createState(signals),})
                        if(typeof nextState === 'undefined')
                        {
                            signal = signalFlag ? signals.find(s=>s.working) : signals.find(s=>!s.working);
                        }
                        else{
                            let label = whichSignalIsDifferent(states[states.length-1],nextState);
                            signal = signals.find(s=>s.label === label);
                        }
                        newDependencies.push({tact: i.part[i.part.length-1].tact+0.5,label: signal.label,
                            type: signal.working ? 'falling' : 'rising'});
                    
                        signal.working ? signal.signalChanges.push('-') : signal.signalChanges.push('+');
                        updateCodedSignals(signal,signals);
                        signal.working = !signal.working;
                    }
                    else{
                        let label;
                        let prevState = j === indexedParts.length-1 ? states[0] : states[states.length-1];
                        let nextState = j === indexedParts.length-1 ? states.find(s=>s.index === indexedParts[0].index):states.find(s=>s.index === indexedParts[j+1].index);
                        label = whichSignalIsDifferent(prevState,state);
                        let signal = prevState.index === nextState?.index ? signals.find(s=>s.label === label) : signals.find(s=>s.label !== label);
                        newDependencies.push({tact: i.part[i.part.length-1].tact+0.5,label : signal.label,
                            type: signal.working ? 'falling' : 'rising'});
                            signal.working ? signal.signalChanges.push('-') : signal.signalChanges.push('+');
                        states.push({index: i.index,states:createState(signals),})
                        updateCodedSignals(signal,signals);
                        signal.working = !signal.working;
                    }

                });
            newDependencies.sort((a,b)=> a.tact - b.tact);
            return {dependencies: newDependencies,tacts: newDependencies.length,labels:signals,indices:indexedParts}
       }
    }

}

export default TableService;