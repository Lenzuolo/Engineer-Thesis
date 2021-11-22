import React, { useState, useContext,useEffect} from 'react';
import Chart from 'react-apexcharts';
import { SignalContext } from '../../../../contexts';
import {Button,Card} from 'antd';
import {ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,UndoOutlined} from '@ant-design/icons'
import './TimeChart.css';
import { displayNotification } from '../../../../components';
import { options} from './options';

const TimeChart = ({label,sigType}) => 
{

    const {inArrays,outArrays, addArray, updateArray } = useContext(SignalContext);
    const [data,setData] = useState([]);
    const [xVal,setXVal] = useState(0);
    const [series,setSeries] = useState([{name:'',data: data}]);
    const [maxTicks,setMaxTicks] = useState(10);

    console.log(inArrays,outArrays);

    const chartOptions = {...options,yaxis: {...options.yaxis,title:{text:label}},
            xaxis: {...options.xaxis,max:maxTicks}};

    useEffect(()=>{
        if(xVal > 10)
        {
            setMaxTicks(xVal);
        }
    },[xVal]);


    const onUpButtonClick = () =>
    {
        const newData = [...data];
        if(newData.length === 0)
        {
            addArray({data,label,sigType});
        }

        newData.push({x: xVal, y: 1});

        if(!updateArray({data: newData,label,sigType}))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            newData.pop();
        }
        else
        {
            setXVal(xVal+1);
        }
        setSeries([{data: newData}]);
        setData(newData);
    }

    const onDownButtonClick = () =>
    {
        const newData = [...data];
        if(newData.length === 0)
        {
            addArray({data,label,sigType});
        }

        newData.push({x: xVal, y: 0});

        if(!updateArray({data: newData,label,sigType}))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            newData.pop();
        }
        else
        {
            setXVal(xVal+1);
        }
        setSeries([{data: newData}]);
        setData(newData);
    }

    const onClearButtonClick = () =>
    {
        const empty = [];
        setData([]);
        updateArray({empty,label,sigType});
        setXVal(0);
        setSeries([{data: empty}]);
    }

    const onUndoButtonClick = () =>
    {
        setData(oldData => {
            const newData = [...oldData];
            newData.pop();
            return newData;
        });
        updateArray({data,label,sigType});
        setXVal(xVal-1);
        setSeries([{data: data}]);
    }

    return (
        <Card bordered={false} className='card' style={{ maxHeight:200,boxShadow:'none',alignItems:'stretch'}}> 
            <div style={{display:'flex',flex: '0 0 70%',alignItems:'center'}}>
                <Chart series={series} options={chartOptions} height={150} width={400} type='line'/>
            </div>
            <div style={{flex: '0 0 30%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                <Button icon={<ArrowUpOutlined/>} onClick={onUpButtonClick}/>
                <Button icon={<ArrowDownOutlined/>} onClick={onDownButtonClick}/>
                <Button icon={<CloseOutlined/>} onClick={onClearButtonClick}/>
                <Button icon={<UndoOutlined/>} onClick={onUndoButtonClick}/>
            </div>
        </Card>
    );


}

export default TimeChart;