import React, { useContext, useEffect, useState } from 'react';
import { SignalContext } from '../../../../contexts';
import { TableService } from '../../../../services';
import './ConnectionOrderTable.css';


const ConnectionOrderTable = ({signalsIn,signalsOut}) =>
{
    const {inArrays,outArrays,length} = useContext(SignalContext);
    const [mappedCols,setMappedCols] = useState([]);
    const [mappedRows,setMappedRows] = useState([]);
    const [NSU, setNSU] = useState([]);
    const [dependenciesArray,setDependenciesArray] = useState([]);
    const [tacts,setTacts] = useState(0);

    useEffect(()=>
    {
        const {tacts,dependencies} = TableService.calculateTacts(inArrays,outArrays,length);
        setTacts(tacts);
        setDependenciesArray(dependencies);
        generateColumns();
        generateRows();
        generateNSU();
    },[tacts]);
    
    const generateNSU = () =>
    {
        const signals = [...inArrays,...outArrays];
        if(dependenciesArray.length != 0)
        {
            const nsuArray  = TableService.calculateNSU(dependenciesArray,signals,tacts);
            console.log(nsuArray);
            const mappedNsu = nsuArray.map(n=>
                (<td key={n.tact}><b>{n.NSU}</b></td>)
            );
            setNSU(mappedNsu);
        }
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
        const array = [];
        dependenciesArray.forEach(da =>{
            if(da.label === label){
                array.push({tact:da.tact,type:da.type});
            }
        })
        
        if(array.length != 0)
        {
            for(let i = 1;i<tacts;i++)
            {
                const change = array.find(a=> a.tact === i);
                if(change){
                    if(change.type === 'rising'){
                        data.push((<td key={i}><b>+</b></td>));
                    }
                    else if(change.type === 'falling'){
                        data.push((<td key={i}><b>-</b></td>));
                    }
                }
                else{
                    data.push((<td key={i}><b></b></td>));
                }
            }
        }
        else return;
        
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
        <table style={{width:'60%'}}>
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
                    <td key={0}><b>0</b></td>
                    {NSU}
                </tr>
            </tfoot>
        </table>
    );
}

export default ConnectionOrderTable;
