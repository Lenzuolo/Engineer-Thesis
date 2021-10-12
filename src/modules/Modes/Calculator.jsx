import React, { useState } from 'react';
import { Form,InputNumber,Button,Card} from 'antd';
import { LABELS_IN, LABELS_OUT } from '../../utils';
import { TimeChart } from './TimeCharts';

const Calculator = () =>
{
    const [step,setStep] = useState(1);
    const [signalsIn,setSignalsIn] = useState(1);
    const [signalsOut,setSignalsOut] = useState(1);
    const [labelsIn,setLabelsIn] = useState([]);
    const [labelsOut,setLabelsOut] = useState([]);

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
            labelsIn.push(LABELS_OUT[i]);
        }
        setStep(2);

    }

    return (
        <div style={{display:'flex',justifyContent:'center',paddingTop:20}}>
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
                <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100'}}>
                    <Card title='Sygnały Wejściowe' style={{minWidth:600}}>
                        {
                            labelsIn.map(li=>
                                {
                                    <TimeChart label={li}/>
                                })
                        }
                    </Card>
                    <Card title='Sygnały Wyjściowe' style={{minWidth:600}}>
                        {
                            labelsOut.map(lo=>
                                {
                                    <TimeChart label={lo}/>
                                })
                        }
                    </Card>
                </div>
            )}
        </div>
    )
}

export default Calculator;