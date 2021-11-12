import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import {Button,Card} from 'antd';
import {ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,UndoOutlined, ConsoleSqlOutlined} from '@ant-design/icons'
import './TimeChart.css';

const TimeChart = ({label}) => 
{
    const [data,setData] = useState([]);
    const [xVal,setXVal] = useState(0);
    const series = [{data: data}];
    const options = 
    {
            chart: {
              type: 'line',
              animations:
              {
                  enabled: true,
                  dynamicAnimation: {
                    enabled: true,
                    speed: 350
                    },
              },
              toolbar:
              {
                  show: false,
                  /*tools: {
                    download: false,
                    selection: true,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: true | '<img src="/static/icons/reset.png" width="20">',
                    customIcons: []
                  },*/
              }
            },
            grid:
            {
                show: false,
            },
            stroke: {
              curve: 'stepline',
            },
            xaxis: {
                tickPlacement: 'on',
                labels: {
                    show: true,
                },
                title:
                {
                    text: 't',
                },
                axisBorder: {
                    show: true,
                    color: '#000000',
                },
            },
            yaxis: {
                show: true,
                max: 2,
                min: 0,
                forceNiceScale: true,
                tickAmount: 1,
                axisBorder: {
                    show: true,
                    color: '#000000',
                },
                labels: {
                    show: false,
                },
                title: 
                {
                    text: label,
                }
            },
            tooltip: {
                enabled: false,
            }
    }


    const onUpButtonClick = () =>
    {
        data.push({x: xVal.toString(), y: 1});
        setXVal(xVal+1);
    }

    const onDownButtonClick = () =>
    {
        data.push({x: xVal.toString(), y: 0});
        setXVal(xVal+1);
    }

    const onClearButtonClick = () =>
    {
        setData([]);
        setXVal(0);
    }

    const onUndoButtonClick = () =>
    {
        data.pop();
        setXVal(xVal-1);
    }

    return (
        <Card bordered={false} className='card' style={{ maxHeight:200,boxShadow:'none',marginTop:20,marginBottom:30,alignItems:'stretch'}}> 
            <div style={{display:'flex',flex: '0 0 70%',alignItems:'center'}}>
                <Chart series={series} options={options} height={150} width={400} type='line'/>
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