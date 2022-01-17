import React, { useState, useContext,useEffect} from 'react';
import Chart from 'react-apexcharts';
import { SignalContext } from '../../../../contexts';
import {Button,Card} from 'antd';
import {ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,UndoOutlined} from '@ant-design/icons'
import './TimeChart.css';
import { displayNotification } from '../../../../components';
import { options} from './options';




const TimeChart = ({label,sigType,disabled}) => 
{

    const {inArrays,outArrays, updateArray, arrayChanged } = useContext(SignalContext);
    const [data,setData] = useState([/*{x:0,y:0},{x:1,y:0}*/]);
    const [xVal,setXVal] = useState(0);
    const [series,setSeries] = useState([{name:'',data: data}]);
    const [maxTicks,setMaxTicks] = useState(10);


    function handleClick(event, chartContext, {dataPointIndex}) 
    {
        if(event.button === 0)
        {
            setXVal(dataPointIndex);
        }
    }

    const chartOptions = {...options,
        yaxis: {...options.yaxis,title:{text:label}},
            xaxis: {...options.xaxis,max:maxTicks,tickAmount:maxTicks},
                chart:{...options.chart,events:{...options.chart.events,markerClick:handleClick}},
                    annotations: {xaxis:[{x:xVal,borderColor:'#00f'
                      }]}};

    useEffect(()=>{
        updateSignals();
        if(xVal > maxTicks)
        {
            const ratio = parseInt(Math.round(xVal/10));
            setMaxTicks(10 * ratio + 5);
        }
        else if(xVal < 10)
        {
            setMaxTicks(10);
        }
        else if(xVal < maxTicks - 5)
        {
            const ratio = parseInt(Math.round((xVal-1)/10));
            setMaxTicks(10 * ratio + 5);
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
                        let needUpdating = false;
                        if(dataArr.length === data.length)
                        {
                            for(let i = 0; i < dataArr.length;i++)
                            {
                                if(!(data[i].x === dataArr[i].x)||!(data[i].y === dataArr[i].y))
                                {
                                    needUpdating = true;
                                }
                            }
                        }
                        else
                        {
                            needUpdating = true;
                        }
                        if(dataArr.length !== 0 && needUpdating){
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
                        let needUpdating = false;
                        if(dataArr.length === data.length)
                        {
                            for(let i = 0; i < dataArr.length;i++)
                            {
                                if(!(data[i].x === dataArr[i].x)||!(data[i].y === dataArr[i].y))
                                {
                                    needUpdating = true;
                                }
                            }
                        }
                        else{
                            needUpdating = true;
                        }
                        if(dataArr.length !== 0 && needUpdating){
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
        const element = newData.find((e)=>e.x === xVal);
        let newX;
        if(typeof element === 'undefined')
        {
            newData.push({x: xVal, y: 1});
            newX = xVal+1;
        }
        else
        {
            element.y = 1;
            newX = newData[newData.length-1].x+1;
        }

        if(!updateArray({data: newData,label,sigType},false))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            typeof element === 'undefined' ? newData.pop() : element.y = 0;
        }
        else
        {
            setXVal(newX);
        }
        setSeries([{data: newData}]);
        setData(newData);
    }

    const onDownButtonClick = () =>
    {
        const newData = [...data];

        const element = newData.find((e)=>e.x === xVal);
        let newX;
        if(typeof element === 'undefined')
        {
            newData.push({x: xVal, y: 0});
            newX = xVal+1;
        }
        else
        {
            element.y = 0;
            newX = newData[newData.length-1].x +1;
        }

        if(!updateArray({data: newData,label,sigType},false))
        {
            displayNotification('error',`Ryzyko wyścigu w ${label}`,'Podanie sygnału w ten sposób spowoduje wyścig, cofnięto zmiany');
            typeof element === 'undefined' ? newData.pop() : element.y = 1;
        }
        else
        {
            setXVal(newX);
        }
        setSeries([{data: newData}]);
        setData(newData);
    }

    const onClearButtonClick = () =>
    {
        setData([]);
        updateArray({data: [],label,sigType},false);
        setXVal(0);
        setSeries([{data: []}]);
        setMaxTicks(10);
    }

    const onUndoButtonClick = () =>
    {
        if(data.length >= 1)
        {
            const newData = [...data];

            const element = newData.findIndex((e)=>e.x === xVal-1);
            if(element === newData.length-1)
                newData.pop();
            else
            {
                displayNotification('error','Błąd','Cofanie z punktu wcześniejszego niż ostatni nie jest dozwolone');
                return;
            }
            updateArray({data: newData,label,sigType},true);
            setXVal(xVal-1);
            setSeries([{data: newData}]);
            setData(newData);
        }
    }

    return (
        <Card bordered={false} className='card' style={{ maxHeight:90,boxShadow:'none',alignItems:'center',padding:'0 0',width:'100%'}}> 
            <div style={{display:'flex',flex: '0 0 40%',alignItems:'center'}}>
                <Chart series={series} options={chartOptions} height={85} width={320} type='line'/>
            </div>
            <div style={{flex: '0 0 10%',display:'flex',flexDirection:'column',alignItems:'center',maxHeight: 60}}>
                <Button disabled={disabled}  size='small' style={{display:'flex',height:'25%',justifyContent:'center',marginBottom:3}} icon={<ArrowUpOutlined/>} onClick={onUpButtonClick}/>
                <Button disabled={disabled} size='small' style={{display:'flex',height:'25%',justifyContent:'center',marginBottom:3}} icon={<ArrowDownOutlined/>} onClick={onDownButtonClick}/>
                <Button disabled={disabled} size='small' style={{display:'flex',height:'25%',justifyContent:'center',marginBottom:3}} icon={<CloseOutlined/>} onClick={onClearButtonClick}/>
                <Button disabled={disabled} size='small' style={{display:'flex',height:'25%',justifyContent:'center',marginBottom:3}} icon={<UndoOutlined/>} onClick={onUndoButtonClick}/>
            </div>
        </Card>
    );


}

export default TimeChart;