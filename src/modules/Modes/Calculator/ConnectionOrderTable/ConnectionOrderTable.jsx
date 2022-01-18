import React, { useContext, useEffect, useState } from 'react';
import { TableContext } from '../../../../contexts';
import { Statistics } from './Statistics';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({initial,showBorders,signalsIn,signalsOut}) =>
{
    const {nsuArray,dependencyArray,initialState,borders,indices,additionalSignals,conflictingStates} = useContext(TableContext);
    const [mappedCols,setMappedCols] = useState([]);
    const [mappedRows,setMappedRows] = useState([]);
    const [NSU, setNSU] = useState([]);
    const [mappedBorders,setBorders] = useState([]);
    const [mappedSignals,setSignals] = useState([]);

    useEffect(()=>
    {
        generateColumns();
        generateRows();
        generateNSU();
        if(showBorders)
        {
            generateBorders();
        }
    },[dependencyArray]);

    const generateBorders = () =>
    {
        const nsu = initialState.nsuArray;
        let count = 0;
        let index = 0;
        const mappedBord = nsu.map((n,i)=>{
            if(borders.some(b => b === n.tact)){
                let span = count;
                let ind = index;
                index++;
                if(index > indices.length-1)
                {
                    index = 0;
                }
                count = 0;
                return <td key={i} className='bordered' colSpan={span+1}><b>{indices[ind]}</b></td>
            }
            else
            {
                if(i === nsu.length-1)
                {
                    return <td key={i} className='notBordered' colSpan={count+1}><b>{indices[index]}</b></td>
                }
                count++;
            }
        });

        count = 0;

        const mappedSigs = [];

        mappedSigs.push((
        <tr key={0} className='borders'>
            <th key={'state'} className='notBordered' rowSpan={additionalSignals.length} colSpan={2}>Stan sygnałów dodatkowych:</th>
            <th key={additionalSignals[0].label}className='notBordered' colSpan={2}>{`${additionalSignals[0].label}`}</th>
            {mapSignal(additionalSignals[0].label)}
    </tr>));

        for(let i = 1; i < additionalSignals.length;i++)
        {
            mappedSigs.push((
                <tr key={i} className='borders'>
                    <th key={additionalSignals[i].label}className='notBordered' colSpan={2}>{`${additionalSignals[i].label}`}</th>
                    {mapSignal(additionalSignals[i].label)}
            </tr>));
        };

        setSignals(mappedSigs);
        setBorders(mappedBord);
    }
    
    const mapSignal = (label) =>
    {
        const nsu = initialState.nsuArray;
        let count = 0;
        let index = 0;
        const signal = additionalSignals.find(s=>s.label === label);
        const mappedSig = nsu.map((n,i)=>{
            if(borders.some(b => b === n.tact)){
                let span = count;
                let ind = index;
                index++;
                count = 0;
                return <td key={i} className='bordered' colSpan={span+1}><b>{signal.signalChanges[ind]}</b></td>
            }
            else
            {
                if(i === nsu.length-1)
                {
                    return <td key={i} className='notBordered' colSpan={count+1}><b>{signal.signalChanges[index]}</b></td>
                }
                count++;
            }
        });
        return mappedSig;
    }


    const generateNSU = () =>
    {
        const dep = initial ? initialState.dependencyArray : dependencyArray;
        const nsu = initial ? initialState.nsuArray : nsuArray;
        const conf = initial ? initialState.conflictingStates : conflictingStates

        if(dep.length != 0)
        {
            const mappedNsu = nsu.map(n=>{
                if(typeof conf.find(c=>c.value === n.NSU && c.tacts.includes(n.tact)) !== 'undefined')
                    return (<td key={n.tact} style={{color:'red'}}><b>{n.NSU}</b></td>);
                else
                    return (<td key={n.tact}><b>{n.NSU}</b></td>);
            }
            );

            setNSU(mappedNsu);
        }
    }

    const generateColumns = () =>
    {
        let colTab = [];
        const nsu = initial ? initialState.nsuArray : nsuArray;
        nsu.forEach(n=>{
            if(Number.isInteger(n.tact))
            {
                colTab.push((<th key={n.tact}>{n.tact}</th>));
            }
            else
            {
                colTab.push((<th key={n.tact}>{`${Math.floor(n.tact)}'`}</th>));
            }
        })
        setMappedCols(colTab);

    }

    const generateData = (label,outlet) =>
    {
        let data = [];
        let arrowStart = false
        const dep = initial ? initialState.dependencyArray : dependencyArray;

        const filtered = dep.filter(d=> d.tact === 0);

        dep.forEach((da,i) =>{
            if(i !== dep.length-1)
            {
                if(outlet)
                {
                    const elem = dep[i+1];
                    if(elem.label === label)
                    {
                        if(elem.type === 'rising')
                            arrowStart = true;
                        else if(elem.type === 'falling')
                            arrowStart = false;
                    }
                }                
                if(da.label === label){
                    if(da.type === 'rising')
                    {
                            data.push((<td key={da.tact} style={{
                                borderBottom: arrowStart && '5px solid #2c7436'
                            }}><b>+</b></td>));
                    }
                    else if(da.type === 'falling')
                    {
                            data.push((<td key={da.tact}><b>-</b></td>));
                    }
                }
                else
                {
                    if(da.tact !== 0 )
                    {
                        data.push((<td key={da.tact} style={{
                            borderBottom: arrowStart && '5px solid #2c7436'
                        }}><b></b></td>));
                    }
                    else
                    {
                        if(!filtered.some(d=>d.label === label) && i===0)
                        {
                            data.push((<td key={da.tact} style={{
                                borderBottom: arrowStart && '5px solid #2c7436'
                            }}><b>-</b></td>));
                        }    
                    }
                }
            }
        })
        
        return data;
    }


    const generateRows = () =>{
        
        let i = 0;
        let rowTab = [];

        rowTab.push(
            (
            <tr key={i}>
                <th key='state' rowSpan={signalsIn+signalsOut+(showBorders ? 0 : additionalSignals.length)} colSpan={2} style={{width:'15%'}}>Stan sygnałów</th>
                <th key='signal'>{`X${i}`}</th>
                <th key='state value'>2<sup>{`${i}`}</sup></th>
                {generateData(`X${i}`)}
            </tr>                
            )
        );

        for(i=1; i < signalsIn;i++)
        {
            rowTab.push(
                (
                    <tr key={i}>
                        <th key='signal'>{`X${i}`}</th>
                        <th key='state value'>2<sup>{`${i}`}</sup></th>
                        {generateData(`X${i}`)}
                    </tr>
                )
            )
        }

        for(let j=0; j < signalsOut;i++,j++)
        {
            rowTab.push(
                (
                    <tr key={i}>
                        <th key='signal'>{`Q${j}`}</th>
                        <th key='state value'>2<sup>{`${i}`}</sup></th>
                        {generateData(`Q${j}`,true)}
                    </tr>
                )
            )
        }
        if(!(showBorders || initial))
        {
            for(let j = 0; j < (additionalSignals.length ?? 0);j++,i++)
            {
                rowTab.push(
                    (
                        <tr key={i}>
                            <th key='signal'>{`Z${j}`}</th>
                            <th key='state value'>2<sup>{`${i}`}</sup></th>
                            {generateData(`Z${j}`,true)}
                        </tr>
                    )
                )
            }
        }

        setMappedRows(rowTab);
    }

    return (
        <>
        <table style={{width:'40%',marginBottom: 15}}>
            <thead>
            <tr>
                <th colSpan={4} style={{width: '30%'}}>Takty</th>
                {mappedCols}
            </tr>
            </thead>
            <tbody>
                {mappedRows}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={4}>NSU</th>
                    {NSU}
                </tr>
                {showBorders &&
                    (
                    <>
                        <tr className='borders'>
                            <th className='notBordered' colSpan={4}>Części:</th>
                            {mappedBorders}
                        </tr>
                        {mappedSignals}
                    </>
                    )
                }
            </tfoot>
        </table>
        {!showBorders && (<Statistics initial={initial}/>)}
        </>
    );
}

export default ConnectionOrderTable;
