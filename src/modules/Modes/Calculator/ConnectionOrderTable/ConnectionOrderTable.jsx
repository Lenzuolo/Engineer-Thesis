import React, { useEffect, useState } from 'react';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({rows,cols}) =>
{
    const [mappedCols,setMappedCols] = useState([]);
    useEffect(()=>{generateColumns();console.log(mappedCols);},[]);
    
    const generateColumns = () =>
    {
        let colTab = [];
        for(let i = 0; i < cols;i++)
        {
            colTab.push(i);
        }

        console.log(colTab);

        setMappedCols(colTab.map(c=>
            (
            <th key={c}>{c}</th>
        )));

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
            <tr>
                <th rowSpan={rows} colSpan={2} style={{width:'15%'}}>Stan sygnałów</th>
                <th>x</th>
                <th>1</th>
                <td>-</td>
            </tr>
            <tr>
                <th>y</th>
                <th>2</th>
                <td>-</td>
            </tr>
            <tr>
                <th>z</th>
                <th>4</th>
                <td>-</td>
            </tr>
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
