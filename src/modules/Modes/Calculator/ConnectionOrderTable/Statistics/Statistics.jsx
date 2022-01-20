import React, { useContext, useEffect, useState } from 'react';
import { SignalContext, TableContext } from '../../../../../contexts';
import { CustomText } from '../../../../../components';
import { uniqNSU, signalLabels } from '../../../../../utils';

const Statistics = ({initial}) =>{
    
    const {solvable,conditionsArray,conflictingStates,notConflictingStates,additionalSignals,initialState} = useContext(TableContext);
    const {inArrays, outArrays} = useContext(SignalContext);
    const [mappedConditions,setMappedConditions] = useState([]);
    const [mappedConflictingStates,setMappedConflictingStates] = useState([]);

    useEffect(()=>generateMappedContent(),[solvable]);

    const generateMappedContent = () => {
 
        let mapConfStates = [];
        let mappedCond = []

        const signals = [];

        
        const cond = initial ? initialState.conditionsArray : conditionsArray;
        const cs = initial ? initialState.conflictingStates : conflictingStates;


        inArrays.forEach(i => signals.push(i.label));
        outArrays.forEach(o => signals.push(o.label));


        if(additionalSignals.length > 0)
        {
            signalLabels('addition',additionalSignals.length).forEach(a => signals.push(a));
        }

        signals.reverse();

        cond.forEach((c,i) =>{
            let uniqWC = uniqNSU(c.workingConditions);
            uniqWC.sort((a,b)=>a-b);
            mappedCond.push((
                <CustomText key={`WC${i}`} strong size={16}>
                    {`Warunki działania dla ${c.label}: ∑(${uniqWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
            let uniqNWC = uniqNSU(c.notWorkingConditions);
            uniqNWC.sort((a,b)=>a-b);
            mappedCond.push((
                <CustomText key={`NWC${i}`} strong size={16}>
                    {`Warunki niedziałania dla ${c.label}: ∏(${uniqNWC.toString()})`}
                    <sub>{signals.join('')}</sub> 
                </CustomText>
            ));
        });

        mapConfStates.push((<CustomText key='state' strong size={16}>Znaleziono stany sprzeczne:</CustomText>))

        mapConfStates.push(cs.map((c,i)=>(
           <CustomText key={i} strong size={16}>{`Stan ${c.value} w taktach ${c.tacts.toString()} dla ${c.label}`}</CustomText> 
        )));

        setMappedConditions(mappedCond);
        setMappedConflictingStates(mapConfStates);

    }


    return(
        <>
        {
            (initial ? initialState.solvable : solvable) ?
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <CustomText strong size={16}>Rozwiązywalna: Tak</CustomText>
                    {/* {mappedWorkingConditions}
                    {mappedNotWorkingConditions} */}
                    {mappedConditions}
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