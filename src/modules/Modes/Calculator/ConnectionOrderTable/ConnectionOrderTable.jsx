import React, { useEffect, useState } from 'react';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({signalsIn,signalsOut}) =>
{
    const [mappedCols,setMappedCols] = useState([]);
    const [mappedRows,setMappedRows] = useState([]);
    const [tacts,setTacts] = useState(10);

    useEffect(()=>{generateColumns();generateRows();},[]);
    
    const generateColumns = () =>
    {
        let colTab = [];
        for(let i = 0; i < tacts;i++)
        {
            colTab.push(i);
        }

        setMappedCols(colTab.map(c=>
            (
            <th key={c}>{c}</th>
        )));

    }

    const generateRows = () =>{
        
        let i = 0;
        let rowTab = [];

        rowTab.push(
            (
            <tr key={i}>
                <th key='state' rowSpan={signalsIn+signalsOut} colSpan={2} style={{width:'15%'}}>Stan sygnałów</th>
                <th key='signal'>{`X${i}`}</th>
                <th key='state value'>2<sup>{`${i}`}</sup></th>
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
                    </tr>
                )
            )
        }

        setMappedRows(rowTab);
    }



    return (
        <table style={{width:'40%'}}>
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
                    <td>0</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default ConnectionOrderTable;
