import React, { useState, useContext,useEffect} from 'react';
import Chart from 'react-apexcharts';
import { SignalContext } from '../../../contexts';
import {Button,Card} from 'antd';
import {ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,UndoOutlined} from '@ant-design/icons'
import './TimeChart.css';
import { displayNotification } from '../../../components';
import { options} from './options';

const TimeChart = ({label,sigType}) => 
{

    const { addArray, updateArray } = useContext(SignalContext);
    const [data,setData] = useState([]);
    const [xVal,setXVal] = useState(0);
    const [series,setSeries] = useState([{name:'',data: data}]);

    const chartOptions = {...options,yaxis: {...options.yaxis,title:{text:label}}};


    const onUpButtonClick = () =>
    {
        if(data.length === 0)
        {
            addArray({data,label,sigType});
        }

        data.push({x: xVal/*.toString()*/, y: 1});

        if(!updateArray({data,label,sigType}))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            data.pop();
        }
        else
        {
            setXVal(xVal+1);
        }
        setSeries([{data: data}]);
    }

    const onDownButtonClick = () =>
    {
        if(data.length === 0)
        {
            addArray({data,label,sigType});
        }

        data.push({x: xVal/*.toString()*/, y: 0});

        if(!updateArray({data,label,sigType}))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            data.pop();
        }
        else
        {
            setXVal(xVal+1);
        }
        setSeries([{data: data}]);
    }

    const onClearButtonClick = () =>
    {
        const empty = [];
        setData([]);
        updateArray({empty,label,sigType});
        setXVal(0);
        setSeries([{data: data}]);
    }

    const onUndoButtonClick = () =>
    {
        data.pop();
        updateArray({data,label,sigType});
        setXVal(xVal-1);
        setSeries([{data: data}]);
    }

    return (
        <Card bordered={false} className='card' style={{ maxHeight:200,boxShadow:'none',marginTop:20,marginBottom:30,alignItems:'stretch'}}> 
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