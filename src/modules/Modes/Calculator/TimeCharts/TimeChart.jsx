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

    const {inArrays,outArrays, addArray, updateArray, arrayChanged } = useContext(SignalContext);
    const [data,setData] = useState([]);
    const [xVal,setXVal] = useState(0);
    const [series,setSeries] = useState([{name:'',data: data}]);
    const [maxTicks,setMaxTicks] = useState(10);


    const chartOptions = {...options,yaxis: {...options.yaxis,title:{text:label}},
            xaxis: {...options.xaxis,max:maxTicks}};

    useEffect(()=>{
        updateSignals();
        if(xVal > 10)
        {
            setMaxTicks(xVal);
        }
    },[xVal,arrayChanged]);

    const updateSignals = () => {
        let newData;
        switch(sigType){
            case 'in':
                if(inArrays.length !== 0){
                    newData = inArrays.find(arr => arr.label === label);
                    if(newData){
                        let dataArr = newData.data;
                        if(dataArr.length !== 0){
                            setData(dataArr);
                            setSeries([{data: dataArr}]);
                            setXVal(dataArr[dataArr.length-1].x + 1);
                        }
                    }
                }
                break;
            case 'out':
                if(outArrays.length !== 0){
                    newData = outArrays.find(arr => arr.label === label);
                    if(newData){
                        let dataArr = newData.data;
                        if(dataArr.length !== 0){
                            setData(dataArr);
                            setSeries([{data: dataArr}]);
                            setXVal(dataArr[dataArr.length-1].x + 1);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }


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
        updateArray({data: empty,label,sigType});
        setXVal(0);
        setSeries([{data: empty}]);
    }

    const onUndoButtonClick = () =>
    {
        if(data.length > 0)
        {
            const newData = [...data];
            newData.pop();
            updateArray({data: newData,label,sigType});
            setXVal(xVal-1);
            setSeries([{data: data}]);
            setData(newData);
        }
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