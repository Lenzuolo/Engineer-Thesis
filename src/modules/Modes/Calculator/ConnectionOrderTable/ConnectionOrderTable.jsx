import React, { useContext, useEffect, useState } from 'react';
import { SignalContext } from '../../../../contexts';
import { TableService } from '../../../../services';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({signalsIn,signalsOut}) =>
{
    const {inArrays,outArrays} = useContext(SignalContext);
    const [mappedCols,setMappedCols] = useState([]);
    const [mappedRows,setMappedRows] = useState([]);
    const [changesArray,setChangesArray] = useState([]);
    const [tacts,setTacts] = useState(0);

    useEffect(()=>
    {
        const {tacts,changes} = TableService.calculateTacts([...inArrays,...outArrays]);
        setTacts(tacts);
        setChangesArray(changes);
        generateColumns();
        generateRows();
    },[tacts]);
    
    const generateNSU = () =>
    {

    }

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

    const generateData = (label) =>
    {
        let data = [(<td key='start'><b>-</b></td>)];
        const obj = changesArray.find(a=>a.label === label);
        let row;

        if(obj)
        {
            row = obj.signalChange;
        }
        else return;

        for(let i = 1;i<tacts;i++)
        {
            if(row.rising.includes(i))
            {
                data.push(<td key={i}><b>+</b></td>);
            }
            else if(row.falling.includes(i))
            {
                data.push(<td key={i}><b>-</b></td>);
            }
            else
            {
                data.push(<td key={i}></td>);
            }
        }
        
        return data;
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
