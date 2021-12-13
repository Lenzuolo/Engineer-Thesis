import React, { useCallback, useContext, useState} from 'react';
import { SignalContext } from '.';
import { TableService } from '../services';

const defaultState = () =>(
{
    solvable: false,
    conflictingStates: [],
    conditionsArray: [],
});

const TableContext = React.createContext(defaultState());


const TableContextProvider = ({children}) => {

    const [state,setState] = useState(defaultState());
    const { outArrays } = useContext(SignalContext);

    const checkSolvable = ({dependencyArray,nsuArray}) =>{
        
        let conditionsArray = []
        let conflictingStates = []

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

        let isSolvable = false;
        if(conflictingStates.length == 0){
            isSolvable = true;
        }

        setState({solvable:isSolvable, conditionsArray: conditionsArray, conflictingStates: conflictingStates});
    }


    return (
        <TableContext.Provider value={{...state,checkSolvable}}>
            {children}
        </TableContext.Provider>
    )
}

export {TableContext,TableContextProvider};

