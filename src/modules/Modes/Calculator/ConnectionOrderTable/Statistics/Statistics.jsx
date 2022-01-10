import React, { useContext, useEffect, useState } from 'react';
import { SignalContext, TableContext } from '../../../../../contexts';
import { CustomText } from '../../../../../components';
import { uniqNSU, signalLabels } from '../../../../../utils';

const Statistics = () =>{
    
    const {solvable,conditionsArray,conflictingStates,notConflictingStates,additionalSignals} = useContext(TableContext);
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

        if(additionalSignals > 0)
        {
            signalLabels('addition',additionalSignals).forEach(a => signals.push(a));
        }

        signals.reverse();

        conditionsArray.forEach((c,i) =>{
            let uniqWC = uniqNSU(c.workingConditions);
            uniqWC.sort((a,b)=>a-b);
            mapWorkCond.push((
                <CustomText key={`WC${i}`} strong size={16}>
                    {`Warunki działania dla ${c.label}: ∑(${uniqWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
            let uniqNWC = uniqNSU(c.notWorkingConditions);
            uniqNWC.sort((a,b)=>a-b);
            mapNotWorkCond.push((
                <CustomText key={`NWC${i}`} strong size={16}>
                    {`Warunki niedziałania dla ${c.label}: ∏(${uniqNWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
        });

        mapConfStates.push((<CustomText key='state' strong size={16}>Znaleziono stany sprzeczne:</CustomText>))

        mapConfStates.push(conflictingStates.map((c,i)=>(
           <CustomText key={i} strong size={16}>{`Stan ${c.value} w taktach ${c.tacts.toString()} dla ${c.label}`}</CustomText> 
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