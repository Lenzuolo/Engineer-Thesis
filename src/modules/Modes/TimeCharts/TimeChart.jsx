import React, { useState } from 'react';
import {CanvasJSChart} from 'canvasjs-react-charts';
import {Button,Card} from 'antd';
import {ArrowUpOutlined,ArrowDownOutlined,CloseOutlined,UndoOutlined} from '@ant-design/icons'

const TimeChart = ({label}) => 
{
    const [data,setData] = useState([]);
    const options = {
        theme: 'light1',
        animationEnabled: true,
        axisY:{ title: {label}},
        data: data
    }

    return (
        <Card style={{display:'flex',justifyContent:'space-between'}}> 
            <Card.Grid style={{width:'80%'}}>
                <CanvasJSChart options={options}/>
            </Card.Grid>
            <Card.Grid style={{display:'flex',flexDirection:'column'}}>
                <Button icon={<ArrowUpOutlined/>}/>
                <Button icon={<ArrowDownOutlined/>}/>
                <Button icon={<CloseOutlined/>}/>
                <Button icon={<UndoOutlined/>}/>
            </Card.Grid>
        </Card>
    );


}

export default TimeChart;