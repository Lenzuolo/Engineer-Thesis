import React, { useContext, useState} from 'react';
import { SignalContext } from '.';
import { TableService } from '../services';
import { STATUS } from '../utils';

const defaultState = () =>(
{
    solvable: false,
    conflictingStates: [],
    notConflictingStates: [],
    conditionsArray: [],
    nsuArray: [],
    dependencyArray: [],
    tacts: 0,
    borders: [],
    indices: [],
    calculationStatus: STATUS.IDLE,
    additionalSignals: [],
    initialState: {
        conflictingStates: [],
        notConflictingStates: [],
        conditionsArray: [],
        nsuArray: [],
        dependencyArray: [],
        solvable: false,
    } 
});

const TableContext = React.createContext(defaultState());


const TableContextProvider = ({children}) => {

    const [state,setState] = useState(defaultState());
    const { inArrays,outArrays} = useContext(SignalContext);


    const calculateTableValues = (length,arrIn,arrOut) => {
        const {tacts,dependencies} = TableService.calculateTacts(arrIn,arrOut,length);
        const signals = [...arrIn,...arrOut];
        const nsuArray  = TableService.calculateNSU(dependencies,signals);
        setState((prev=>{
            const newState = {...prev};
            newState.dependencyArray = dependencies;
            newState.tacts = tacts;
            newState.nsuArray = nsuArray;
            newState.initialState.nsuArray = nsuArray;
            newState.initialState.dependencyArray = dependencies;
            return newState;
        }));

        return {dependencies,nsuArray};
    }

    const checkSolvable = ({dependencyArray,nsuArray},additionalSignals,initial) =>{
        
        let conditionsArray = []
        let conflictingStates = []
        let notConflictingStates = [];

        let outSignals = [...outArrays,...additionalSignals ?? []];

        outSignals.forEach(arr=>{
            conditionsArray.push(TableService.calculateConditions(arr.label,dependencyArray,nsuArray));
        });

        // eslint-disable-next-line no-debugger
        debugger;
        conditionsArray.forEach(c =>{
            for(let i = 0; i < c.workingConditions.length; i++){
                for(let j = 0; j < c.notWorkingConditions.length; j++){
                    if(c.workingConditions[i].NSU === c.notWorkingConditions[j].NSU){
                        conflictingStates.push({
                            label: c.label,
                            value: c.workingConditions[i].NSU, 
                            tacts: [c.workingConditions[i].tact,c.notWorkingConditions[j].tact].sort((a,b)=>a-b)
                        });
                    }
                }
            }
        });

        conflictingStates.sort((a,b)=> {
            if(a.tacts[1] === b.tacts[1])
            // {
                return a.tacts[0] - b.tacts[0];
            // }
            return a.tacts[1] - b.tacts[1];
        });

        conditionsArray.forEach(c =>{
            for( let i = 0; i < c.workingConditions.length;i++){
                let tacts = [c.workingConditions[i].tact];
                for( let j = i + 1; j < c.workingConditions.length;j++){
                    if(c.workingConditions[i].NSU === c.workingConditions[j].NSU){
                        tacts.push(c.workingConditions[j].tact);
                    }
                }
                if(tacts.length > 1)
                {
                    if(!notConflictingStates.some(s=> s.value === c.workingConditions[i].NSU))
                    {
                        notConflictingStates.push({
                            label: c.label,
                            value: c.workingConditions[i].NSU,
                            working: true,
                            tacts
                        });
                    }
                }
            }

            for( let i = 0; i < c.notWorkingConditions.length;i++){
                let tacts = [c.notWorkingConditions[i].tact];
                for( let j = i + 1; j < c.notWorkingConditions.length;j++){
                    if(c.notWorkingConditions[i].NSU === c.notWorkingConditions[j].NSU){
                        tacts.push(c.notWorkingConditions[j].tact);
                    }
                }
                if(tacts.length > 1)
                {
                    if(!notConflictingStates.some(s=> s.value === c.notWorkingConditions[i].NSU && s.working === false))
                    {
                        notConflictingStates.push({
                            label: c.label,
                            value: c.notWorkingConditions[i].NSU,
                            working: false,
                            tacts
                        });
                    }
                }
            }
        })


        let isSolvable = false;
        if(conflictingStates.length === 0){
            isSolvable = true;
        }

        setState((prev=>{
            const newState = {...prev}
            newState.solvable = isSolvable; 
            newState.conditionsArray = conditionsArray; 
            newState.conflictingStates = conflictingStates;
            newState.notConflictingStates = notConflictingStates;
            if(initial)
            {
                newState.initialState.conflictingStates = conflictingStates;
                newState.initialState.notConflictingStates = notConflictingStates;
                newState.initialState.conditionsArray = conditionsArray;
                newState.initialState.solvable = isSolvable;
            }
            return newState;
        }));
    }

    const solveTable = () => {
        setState((prev=>{
            const newState = {...prev}
            newState.calculationStatus = STATUS.LOADING;
            return newState;
        }));
        const {borders,stack} = TableService.findBorders(state.nsuArray,state.conflictingStates,state.notConflictingStates);
        const {dependencies,tacts,labels,indices} = TableService.codeSignals(borders,stack,state.dependencyArray,
            {conflictingStates:state.conflictingStates});
        const nsuArray = TableService.calculateNSU(dependencies,[...inArrays,...outArrays,...labels]);
        checkSolvable({dependencyArray: dependencies,nsuArray:nsuArray},labels,false);
        setState((prev=>{
            const newState = {...prev}
            newState.tacts = tacts;
            newState.borders = borders;
            newState.dependencyArray = dependencies;
            newState.nsuArray = nsuArray;
            newState.indices = indices;
            newState.calculationStatus = STATUS.FINISHED;
            newState.additionalSignals = labels;
            return newState;
        }));
    }

    const clearTableContext = () => {
        setState(defaultState());
    }

    return (
        <TableContext.Provider value={{...state,checkSolvable,calculateTableValues,solveTable,clearTableContext}}>
            {children}
        </TableContext.Provider>
    )
}

export {TableContext,TableContextProvider};

