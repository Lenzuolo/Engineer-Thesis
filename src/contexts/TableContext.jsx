import React, { useCallback, useContext, useState} from 'react';
import { SignalContext } from '.';
import { TableService } from '../services';

const defaultState = () =>(
{
    solvable: false,
    conflictingStates: [],
    notConflictingStates: [],
    conditionsArray: [],
    nsuArray: [],
    dependencyArray: [],
    tacts: 0,
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

    const checkSolvable = ({dependencyArray,nsuArray}) =>{
        
        let conditionsArray = []
        let conflictingStates = []
        let notConflictingStates = [];

        outArrays.forEach(arr=>{
            conditionsArray.push(TableService.calculateConditions(arr.label,dependencyArray,nsuArray));
        });

        conditionsArray.forEach(c =>{
            for(let i = 0; i < c.workingConditions.length; i++){
                for(let j = 0; j < c.notWorkingConditions.length; j++){
                    if(c.workingConditions[i].NSU === c.notWorkingConditions[j].NSU){
                        conflictingStates.push({
                            label: c.label,
                            value: c.workingConditions[i].NSU, 
                            tacts: [c.workingConditions[i].tact,c.notWorkingConditions[j].tact]
                        });
                    }
                }
            }
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
                    if(!notConflictingStates.some(s=> s.value === c.WorkingConditions[i].NSU))
                    notConflictingStates.push({
                        label: c.label,
                        value: c.workingConditions[i].NSU,
                        working: true,
                        tacts
                    });
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

    }

    return (
        <TableContext.Provider value={{...state,checkSolvable,calculateTableValues,solveTable}}>
            {children}
        </TableContext.Provider>
    )
}

export {TableContext,TableContextProvider};

