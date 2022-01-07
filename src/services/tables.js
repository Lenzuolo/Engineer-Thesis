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

function isNotConflictingState(borderTact,state,notConfArray){
    const existingState = notConfArray.find(s => s.value === state.NSU);
    if(typeof existingState !== 'undefined'){
        const tacts = existingState.tacts;
        for(let i = 0; i < tacts.length; i++){
            if(tacts[i] >= borderTact && tacts[i] < state.tact){
                return true;
            }
        }
    }
    return false;
}

function isAnotherConflict(state,confArray){
    let existingStates = [];
    confArray.forEach(c =>{
        if(c.value === state.NSU){
            if(c.tacts.some(t=> t === state.tact)){
                existingStates.push(c);
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

        /*if(dependencyArray[dependencyArray.length-1].type ==='falling'){
            dependencyArray.pop();
            tact--;
        }*/

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
        
        let shiftedNsu = [...nsuArray];
        //shiftedNsu.unshift({tact: 0, NSU: 0});
        let workingConditions = [];
        let notWorkingConditions = [...shiftedNsu];
        let start = null,end = null;

        for(let i = 0; i < dependencyArray.length; i++){
            if(label === dependencyArray[i].label){
                if(dependencyArray[i].type === 'rising'){
                    start = dependencyArray[i].tact - 1;
                }
                else if(dependencyArray[i].type === 'falling'){
                    end = dependencyArray[i].tact - 1;
                }
                if(start !== null && end !== null){
                    let sliced = shiftedNsu.slice(start,end);
                    workingConditions = workingConditions.concat(sliced);
                    start = null;
                    end = null;
                }
            }
        }

        notWorkingConditions = notWorkingConditions.filter(nwc => !workingConditions.includes(nwc));

        return { workingConditions: workingConditions, notWorkingConditions: notWorkingConditions, label: label};
    }

    static solveTable(nsuArray,conflictingStates,notConflictingStates){
        
        let solved = false;
        let endOfCycle = false;
        let reduction = false;
        let prevTact = 0;
        let index = 0;
        let offset = 1;
        let borders = [];
        let arr = [...conflictingStates];
        let stack = [[...nsuArray]];
        while(!solved){
            
            if(reduction)
            {
                let toReduce = [];
                stack.forEach(p=>{
                    if(p.some(s=>s.tact === borders[0] || s.tact === borders[0]+1))
                    {
                        toReduce = toReduce.concat(p);
                    }
                });

                let reducable = true;

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
                    //TODO: Redukcja granic
                }
                solved = true;

            }
            else
            {
                let state = arr[index];
                let currentPart = stack[stack.length-1];
                if(!isStateInPart(state.tacts[0],currentPart))
                {
                    index++;
                    if(index >= conflictingStates.length && 
                        currentPart[currentPart.length-1].tact === nsuArray[nsuArray.length-1].tact)
                        {
                            endOfCycle = true;
                            const merged = currentPart.concat([...stack[0]]);
                            stack.shift();
                            stack.push(merged);
                        }
                }
                else
                {
                    let tact = state.tacts[1]-offset
                    let nsuVal = currentPart.find(n=>n.tact === tact);
                    if(!isNotConflictingState(prevTact,nsuVal,notConflictingStates) && !isAnotherConflict(nsuVal,conflictingStates)){
                        borders.push(tact);
                        offset = 1;
                        const firstPart = currentPart.slice(0, currentPart.indexOf(nsuVal)+1)
                        const secondPart = currentPart.slice(currentPart.indexOf(nsuVal)+1);
                        stack.pop();
                        stack.push(firstPart);
                        stack.push(secondPart);
                        if(endOfCycle){
                            // eslint-disable-next-line no-debugger
                            debugger
                            reduction = true;
                            endOfCycle = false;
                        }
                        prevTact = tact;
                        index = 0;
                    }
                    else{
                        offset++;
                    }
                }

                if(index >= conflictingStates.length){
                    index = 0;
                }
            }
        }
    }
}

export default TableService;