import React, { useState } from 'react';
import { Form,InputNumber,Button,Card} from 'antd';
import { LABELS_IN, LABELS_OUT } from '../../utils';
import { TimeChart } from './TimeCharts/index.js';
import { ConnectionOrderTable } from './ConnectionOrderTable';
import { SignalContext } from '../../contexts';

const Calculator = () =>
{
    const [step,setStep] = useState(1);
    const [signalsIn,setSignalsIn] = useState(1);
    const [signalsOut,setSignalsOut] = useState(1);
    const [labelsIn,setLabelsIn] = useState([]);
    const [labelsOut,setLabelsOut] = useState([]);
    const [mappedLabelsIn,setMappedLabelsIn]=useState([]);
    const [mappedLabelsOut,setMappedLabelsOut]=useState([]);
    const {clearSignalContext} = React.useContext(SignalContext);

    const onFinish = ({sigIn,sigOut}) =>
    {
        setSignalsIn(sigIn);
        for(let i = 0; i < sigIn; i++)
        {
            labelsIn.push(LABELS_IN[i]);
        }

        setSignalsOut(sigOut);
        for(let i = 0; i < sigOut; i++)
        {
            labelsOut.push(LABELS_OUT[i]);
        }
        setStep(2);

        setMappedLabelsIn(labelsIn.map(li=>
            (
                <TimeChart key={li} label={li} sigType='in'/>
            )));

        setMappedLabelsOut(labelsOut.map(lo=>
            (
                <TimeChart key={lo} label={lo} sigType='out'/>
        )));

        
    }

    return (
        <div style={{display:'flex',justifyContent:'center'}}>
            {step === 1 && (
                <Form
                    name='signals'
                    labelCol={{span: 16}}
                    wrapperCol={{span: 8}}
                    initialValues={{sigIn:1,sigOut:1}}
                    onFinish={onFinish}
                    >
                        <Form.Item
                            label='Sygnały Wejściowe'
                            name='sigIn'
                            rules={[{ required: true, message: 'Proszę podać liczbę sygnałów wejściowych' }]}
                        >
                            <InputNumber min={1} max={5}/>
                        </Form.Item>
                        <Form.Item
                            label='Sygnały Wyjściowe'
                            name='sigOut'
                            rules={[{ required: true, message: 'Proszę podać liczbę sygnałów wyjściowych' }]}
                        >
                            <InputNumber min={1} max={5}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type='primary' htmlType='submit'>Dalej</Button>
                        </Form.Item>
                </Form>
            )}
            {step === 2 && (
                <div style={{display:'flex',flexDirection:'column'}}>
                    <Card title='Sygnały Wejściowe' bordered={false} style={{minWidth:600,marginBottom:20}}>
                        {
                            mappedLabelsIn
                        }
                    </Card>
                    <Card title='Sygnały Wyjściowe' bordered={false} style={{minWidth:600}}>
                        {
                            mappedLabelsOut
                        }
                    </Card>
                    <div style={{display:'flex',justifyContent: 'space-evenly'}}>
                    <Button type='primary' onClick={()=>{
                        setStep(1);
                        setLabelsIn([]);
                        setLabelsOut([]);
                        clearSignalContext();
                    }}>
                            Powrót
                    </Button>
                    <Button type='primary' onClick={()=>{setStep(3)}}>Dalej</Button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <ConnectionOrderTable rows={3} cols ={10}/>
            )}
        </div>
    )
}

export default Calculator;