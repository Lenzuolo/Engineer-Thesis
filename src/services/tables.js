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
    const existingState = notConfArray.find(s => s.value === state.value);
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
        if(c.value === state.value){
            if(c.tacts.some(t=> t > state.tact)){
                existingStates.push(c);
            }
        }
    });
    
    return existingStates.length > 0;
    
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
        let nsuArray = [];
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
        return nsuArray;
    }

    static calculateConditions(label,dependencyArray,nsuArray){
        
        let shiftedNsu = [...nsuArray];
        shiftedNsu.unshift({tact: 0, NSU: 0});
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
        let prevTact = 0;
        let index = 0;
        let offset = 1;
        let borders = [];
        let arr = [...conflictingStates];
        let stack = [{arr:[...nsuArray],checked:false}];
        while(!solved){
            let state = arr[index];
            let tact = state.tacts[1]-offset
            let nsuVal = nsuArray.find(n=>n.tact === tact);
            if(!isNotConflictingState(prevTact,nsuVal,notConflictingStates) && !isAnotherConflict(nsuVal,conflictingStates)){
                borders.push(tact);
                prevTact = tact;
                offset = 1;
            }
            else{
                offset++;
            }
        }
    }
}

export default TableService;