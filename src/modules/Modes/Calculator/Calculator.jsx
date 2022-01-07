import React, { useContext, useState } from 'react';
import { Form,InputNumber,Button,Card} from 'antd';
import { LABELS_IN, LABELS_OUT } from '../../../utils';
import { ConnectionOrderTable } from './ConnectionOrderTable';
import { SignalContext, TableContext } from '../../../contexts';
import { TimeChart } from './TimeCharts';
import { CustomText, displayNotification } from '../../../components';
import './Calculator.css';


const Calculator = () =>
{
    const [step,setStep] = useState(1);
    const [signalsIn,setSignalsIn] = useState(1);
    const [signalsOut,setSignalsOut] = useState(1);
    const [labelsIn,setLabelsIn] = useState([]);
    const [labelsOut,setLabelsOut] = useState([]);
    const [mappedLabelsIn,setMappedLabelsIn]=useState([]);
    const [mappedLabelsOut,setMappedLabelsOut]=useState([]);
    const {clearSignalContext,areSignalsCorrect,addArray} = React.useContext(SignalContext);
    const {checkSolvable,calculateTableValues,solvable} = useContext(TableContext);

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

        clearSignalContext();

        setMappedLabelsIn(labelsIn.map(li=>
            {
                addArray({data:[{x:0,y:0},{x:1,y:0}],label:li,sigType:'in'});
                return <TimeChart key={li} label={li} sigType='in'/>
        }));

        setMappedLabelsOut(labelsOut.map(lo=>
            {
                addArray({data:[{x:0,y:0},{x:1,y:0}],label:lo,sigType:'out'});
                return <TimeChart key={lo} label={lo} sigType='out'/>
            }));

    }

    return (
        <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
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
                <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'stretch'}}>
                    <div style={{display:'flex',justifyContent:'space-evenly'}}>
                        <Card title='Sygnały Wejściowe' className='signalCard' bordered={false} style={{width: '40%'}}>
                            {
                                mappedLabelsIn
                            }
                        </Card>
                        <Card title='Sygnały Wyjściowe' className='signalCard' bordered={false} style={{width: '40%'}}>
                            {
                                mappedLabelsOut
                            }
                        </Card>
                    </div>
                    <div style={{display:'flex',justifyContent:'center'}}>
                        <div style={{display:'flex',justifyContent:'space-between',minWidth: 250}}>
                        <Button type='primary' onClick={()=>{
                            setStep(1);
                            setLabelsIn([]);
                            setLabelsOut([]);
                            clearSignalContext();
                        }}>
                            Powrót
                        </Button>
                        <Button type='primary' onClick={()=>{
                            const {correct,length} = areSignalsCorrect(signalsIn,signalsOut)
                            if(correct){
                                const {dependencies,nsuArray} = calculateTableValues(length);
                                checkSolvable({dependencyArray:dependencies,nsuArray});
                                setStep(3);
                            }
                            else{
                                displayNotification('error','Błąd sygnałów','Nie wszystkie przebiegi mają tą samą ilość sygnałów');
                            }
                        }}>
                            Dalej
                        </Button>
                        </div>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center'}}>
                    <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center',padding: 10}}>
                        <CustomText strong size={18} style={{marginBottom:20}} >Na podstawie podanych sygnałów wygenerowano poniższą TKŁ:</CustomText>
                        <ConnectionOrderTable signalsIn={signalsIn} signalsOut={signalsOut}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'center', padding: 20}}>
                        <div style={{display:'flex',justifyContent:'space-between',minWidth: 250}}>
                        <Button type='primary' onClick={()=>{
                            setStep(2);
                        }}>
                            Powrót
                        </Button>
                    {solvable ? 
                        <Button type='primary' onClick={()=>{
                            setStep(1);
                            clearSignalContext();
                        }}>
                            Powrót na początek
                        </Button> :
                        <Button type='primary' onClick={()=>{
                            setStep(4);
                        }}>
                            Rozwiąż TKŁ
                        </Button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calculator;