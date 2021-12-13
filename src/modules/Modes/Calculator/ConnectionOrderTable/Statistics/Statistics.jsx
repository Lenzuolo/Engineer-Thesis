import React, { useContext, useEffect } from 'react';
import { SignalContext, TableContext } from '../../../../../contexts';
import { CustomText } from '../../../../../components';
import { useState } from 'react/cjs/react.development';
import { uniqNSU } from '../../../../../utils';

const Statistics = ({initial}) =>{
    
    const {solvable,conditionsArray,conflictingStates} = useContext(TableContext);
    const {inArrays, outArrays} = useContext(SignalContext);
    const [mappedWorkingConditions, setMappedWorkingConditions] = useState([]);
    const [mappedNotWorkingConditions, setMappedNotWorkingConditions] = useState([]);
    const [mappedConflictingStates,setMappedConflictingStates] = useState([]);

    useEffect(()=>generateMappedContent(),[solvable]);

    const generateMappedContent = () => {
        let mapWorkCond = [];
        let mapNotWorkCond = [];
        let mapConfStates = [];

        const signals = [];

        inArrays.forEach(i => signals.push(i.label));
        outArrays.forEach(o => signals.push(o.label));

        signals.reverse();

        conditionsArray.forEach(c =>{
            let uniqWC = uniqNSU(c.workingConditions);
            console.log(uniqWC);
            mapWorkCond.push((
                <CustomText strong size={16}>
                    {`Warunki działania dla ${c.label}: ∑(${uniqWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
            let uniqNWC = uniqNSU(c.notWorkingConditions);
            mapNotWorkCond.push((
                <CustomText strong size={16}>
                    {`Warunki nie działania dla ${c.label}: ∏(${uniqNWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
        });

        mapConfStates.push((<CustomText key='state' strong size={16}>Znaleziono stany sprzeczne:</CustomText>))
        mapConfStates.push(conflictingStates.map(c=>(
           <CustomText key={c.value} strong size={16}>{`Stan ${c.value} w taktach ${c.tacts.toString()} dla ${c.label}`}</CustomText> 
        )));

        setMappedWorkingConditions(mapWorkCond);
        setMappedNotWorkingConditions(mapNotWorkCond);
        setMappedConflictingStates(mapConfStates);

    }


    return(
        <>
        {
            solvable ?
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <CustomText strong size={16}>Rozwiązywalna: Tak</CustomText>
                    {mappedWorkingConditions}
                    {mappedNotWorkingConditions}
                </div>
                :
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <CustomText strong size={16}>Rozwiązywalna: Nie</CustomText>
                    {mappedConflictingStates}
                </div>
        }
        </>    
    );
}

export default Statistics;