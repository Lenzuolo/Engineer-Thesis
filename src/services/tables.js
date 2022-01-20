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
            if((sliced.some(p=>p.tact === tacts[i]) && tacts[i] !== state.tact)){
                return true;
            }
            else if(tacts[i] === nextPartEnd)
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
                if(c.tacts.some(t=>t > state.tact && t <= nextPartEnd)){
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
    for(let i = 0; i<parts.length;i++){
        for(let j = i+1;j < parts.length;j++){
            if(!checkParts(parts[i].part,parts[j].part,confArray)){
                canMerge = false;
                break;
            }
        }
    }
    if(canMerge){
        parts.forEach(p=>p.index = parts[0].index);
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
            for(let j = 0; j < outArray.length;j++){
                    const data = outArray[j].data;
                    const { detected, type } = edgeDetector(data[i],data[i+1]);
                    if(detected){
                        signalOut = {label: outArray[j].label, type: type};
                        break;
                    }
            }
            if(signalIn.label !== '')
            {
                dependencyArray.push({tact: tact,label: signalIn.label, type:signalIn.type});
                if(signalOut.label !== ''){
                    dependencyArray.push({tact: tact+1, label: signalOut.label, type: signalOut.type});
                tact+=2;
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
        
        let solved = false;
        let endOfCycle = false;
        let reduction = false;
        let mergeEndProcedure = false;
        let additionalBorderProcedure = {isNeeded: false,bordersAmount: 1, borderAdded: false, stackIndex:0};
        let doubleBorderProcedure = {isNeeded:false, firstBorder: {set: false, index: -1,tact:-1}};
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
                    else
                    {
                        if(borders.length % 2 !== 0)
                        {
                            additionalBorderProcedure.isNeeded = true;
                            reduction = false;
                            stack.sort((a,b)=>a[a.length-1].tact-b[b.length-1].tact);
                        }
                        else{
                            for(let i = 0; i < stack.length;i++)
                            {
                                const {isWrong,index,bordersAmount} = checkPartForProblems(stack[i],i,conflictingStates);
                                if(isWrong){
                                    additionalBorderProcedure.stackIndex = index;
                                    additionalBorderProcedure.bordersAmount = bordersAmount;
                                    reduction = false;
                                    additionalBorderProcedure.isNeeded = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                else{
                    if(stack.length>2){
                        stack.shift();
                    }
                }
                if(additionalBorderProcedure.isNeeded === false)
                    solved = true;
            }
            else if(additionalBorderProcedure.isNeeded)
            {
                currentPart = stack[additionalBorderProcedure.stackIndex];
                let nextPartEnd = currentPart[currentPart.length-1].tact;
                for(let i = currentPart.length-2;i>=0;i--)
                {
                    if(!borders.includes(currentPart[i].tact))
                    {
                        if(!isNotConflictingState(currentPart,nextPartEnd,currentPart[i],notConflictingStates) &&
                            !isAnotherConflict(currentPart[i],nextPartEnd,currentPart,conflictingStates,false))
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
                    if(additionalBorderProcedure.bordersAmount === 0)
                    {
                        solved = true;
                    }
                }
                else
                {
                    additionalBorderProcedure.stackIndex++;
                }
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
                    let tact = (mergeEndProcedure || second-offset < 0) ? 
                        nsuArray[nsuArray.length-offset].tact : second - offset;
                    let nextPartEnd = doubleBorderProcedure.firstBorder.set ? 
                        doubleBorderProcedure.firstBorder.tact : 
                            currentPart[currentPart.length-1].tact;
                    let nsuVal = currentPart.find(n=>n.tact === tact);
                    if(doubleBorderProcedure.isNeeded)
                    {
                        if(isNotConflictingState(currentPart,nextPartEnd,
                            nsuVal,notConflictingStates) || isAnotherConflict(nsuVal,nextPartEnd,currentPart,conflictingStates,true))
                            {
                                borders.push(tact);
                                if(!doubleBorderProcedure.firstBorder.set)
                                {
                                    doubleBorderProcedure.firstBorder.set = true;
                                    doubleBorderProcedure.firstBorder.index = currentPart.indexOf(nsuVal)+1;
                                    doubleBorderProcedure.firstBorder.tact = tact;
                                    if(second-offset > 0)
                                    {
                                        offset++;
                                    }
                                    else{
                                        mergeEndProcedure = true;
                                        offset = 1;
                                    }
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
                                    if(endOfCycle)
                                    {
                                        mergeEndProcedure = false;
                                        reduction = true;
                                        endOfCycle = false;
                                    }
                                    offset = 1;
                                    index = 0;
                                }
                            }
                    }
                    else
                    {
                        if(!isNotConflictingState(currentPart,nextPartEnd,
                            nsuVal,notConflictingStates) && !isAnotherConflict(nsuVal,nextPartEnd,currentPart,conflictingStates,borders.length===0)){
                            borders.push(tact);
                            offset = 1;
                            const firstPart = currentPart.slice(0, currentPart.indexOf(nsuVal)+1)
                            const secondPart = currentPart.slice(currentPart.indexOf(nsuVal)+1);
                            stack.splice(stack.indexOf(currentPart),1,firstPart,secondPart);
                            if(endOfCycle){
                                mergeEndProcedure = false;
                                reduction = true;
                                endOfCycle = false;
                            }
                            index = 0;
                        }
                        else{
                            offset++;
                            if(second-offset >= 0)
                            {
                                if(currentPart.findIndex(a=>a.tact === second-offset) <= currentPart.findIndex(a=>a.tact === first))
                                {
                                    doubleBorderProcedure.isNeeded = true;
                                    offset = 1;
                                }
                            }
                            else
                            {
                                if(endOfCycle)
                                {
                                    offset=1;
                                    if(currentPart.findIndex(a=>a.tact === nsuArray[nsuArray.length-1]) <= currentPart.findIndex(a=>a.tact === first))
                                    {
                                        doubleBorderProcedure.isNeeded = true;
                                    }
                                    else
                                    {
                                        mergeEndProcedure = true;
                                    }
                                }
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
            return {dependencies:newDependencies,tacts:newDependencies.length,labels:[{label:'Z0',signalChanges:['-','+','-']}],indices:[1,2]};
       }
       else{
            const indexedParts = parts.map((p,i)=> ({index:i+1,part: p}));

            // eslint-disable-next-line no-debugger
            debugger;
            for(let i = 0; i < indexedParts.length; i++)
            {
                const filtered = indexedParts.filter((_,j)=> j % 2 === i % 2);
                sameIndexParts(filtered,conflictingStates)
            }

            const {indices,repeats} = partCount(indexedParts);

            let signalAmount = indices.length > 2 ? Math.ceil(indices.length/2) : 1;
            useOneSignal = signalAmount === 1;
            let count = 0;
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
                        let prevState = j === indexedParts.length-1 ? states[0] : states[states.length-1];
                        let label = whichSignalIsDifferent(prevState,state);
                        let signal = signals.find(s=>s.label === label);
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