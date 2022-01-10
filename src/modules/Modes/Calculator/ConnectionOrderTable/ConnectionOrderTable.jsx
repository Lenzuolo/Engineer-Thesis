import React, { useContext, useEffect, useState } from 'react';
import { TableContext } from '../../../../contexts';
import { Statistics } from './Statistics';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({signalsIn,signalsOut,additionalSignals}) =>
{
    const {nsuArray,dependencyArray} = useContext(TableContext);
    const [mappedCols,setMappedCols] = useState([]);
    const [mappedRows,setMappedRows] = useState([]);
    const [NSU, setNSU] = useState([]);

    useEffect(()=>
    {
        generateColumns();
        generateRows();
        generateNSU();
    },[dependencyArray]);
    
    const generateNSU = async() =>
    {
        if(dependencyArray.length != 0)
        {
            const mappedNsu = nsuArray.map(n=>
                (<td key={n.tact}><b>{n.NSU}</b></td>)
            );
            setNSU(mappedNsu);
        }
    }

    const generateColumns = () =>
    {
        let colTab = [];

        nsuArray.forEach(n=>{
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

    const generateData = (label) =>
    {
        let data = [(<td key='start'><b>-</b></td>)];
        dependencyArray.forEach((da,i) =>{
            if(da.label === label){
                if(da.type === 'rising')
                {
                        data.push((<td key={da.tact}><b>+</b></td>));
                }
                else if(da.type === 'falling')
                {
                    if(i !== dependencyArray.length-1)
                    {
                        data.push((<td key={da.tact}><b>-</b></td>));
                    }
                }
            }
            else
            {
                if( i !== dependencyArray.length-1)
                {
                    data.push((<td key={da.tact}><b></b></td>));
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
                <th key='state' rowSpan={signalsIn+signalsOut+(additionalSignals ?? 0)} colSpan={2} style={{width:'15%'}}>Stan sygnałów</th>
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
                        {generateData(`Q${j}`)}
                    </tr>
                )
            )
        }

        for(let j = 0; j < (additionalSignals ?? 0);j++,i++)
        {
            rowTab.push(
                (
                    <tr key={i}>
                        <th key='signal'>{`Z${j}`}</th>
                        <th key='state value'>2<sup>{`${i}`}</sup></th>
                        {generateData(`Z${j}`)}
                    </tr>
                )
            )
        }

        setMappedRows(rowTab);
    }



    return (
        <>
        <table style={{width:'60%',marginBottom: 20}}>
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
            </tfoot>
        </table>
        <Statistics/>
        </>
    );
}

export default ConnectionOrderTable;
