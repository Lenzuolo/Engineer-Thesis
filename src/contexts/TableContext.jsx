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
    calculationStatus: STATUS.IDLE,
    additionalSignals: 0, 
});

const TableContext = React.createContext(defaultState());


const TableContextProvider = ({children}) => {

    const [state,setState] = useState(defaultState());
    const { inArrays,outArrays} = useContext(SignalContext);


    const calculateTableValues = (length) => {
        const {tacts,dependencies} = TableService.calculateTacts(inArrays,outArrays,length);
        const signals = [...inArrays,...outArrays];
        const nsuArray  = TableService.calculateNSU(dependencies,signals);
        setState((prev=>{
            const newState = {...prev};
            newState.dependencyArray = dependencies;
            newState.tacts = tacts;
            newState.nsuArray = nsuArray;
            return newState;
        }));

        return {dependencies,nsuArray};
    }

    const checkSolvable = ({dependencyArray,nsuArray},additionalSignals) =>{
        
        let conditionsArray = []
        let conflictingStates = []
        let notConflictingStates = [];

        let outSignals = [...outArrays,...additionalSignals ?? []];

        outSignals.forEach(arr=>{
            conditionsArray.push(TableService.calculateConditions(arr.label,dependencyArray,nsuArray));
        });

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

        conflictingStates.sort((a,b)=> a.tacts[0]-b.tacts[0]);

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
        if(conflictingStates.length == 0){
            isSolvable = true;
        }


        setState((prev=>{
            const newState = {...prev}
            newState.solvable = isSolvable; 
            newState.conditionsArray = conditionsArray; 
            newState.conflictingStates = conflictingStates;
            newState.notConflictingStates = notConflictingStates;
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
        console.log(borders,stack);
        const {dependencies,tacts,labels} = TableService.codeSignals(borders,stack,state.dependencyArray,
            {conflictingStates:state.conflictingStates});
        console.log(dependencies,labels);
        const nsuArray = TableService.calculateNSU(dependencies,[...inArrays,...outArrays,...labels]);
        checkSolvable({dependencyArray: dependencies,nsuArray:nsuArray},labels);
        setState((prev=>{
            const newState = {...prev}
            newState.tacts = tacts;
            newState.dependencyArray = dependencies;
            newState.nsuArray = nsuArray;
            newState.calculationStatus = STATUS.FINISHED;
            newState.additionalSignals = labels.length;
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

