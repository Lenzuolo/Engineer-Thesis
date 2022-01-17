import React, { useContext, useEffect, useState } from 'react';
import { Form,InputNumber,Button,Card,Spin, Popconfirm} from 'antd';
import { signalLabels, STATUS, MAX_SIGNALS } from '../../../utils';
import { ConnectionOrderTable } from './ConnectionOrderTable';
import { SignalContext, TableContext } from '../../../contexts';
import { TimeChart } from './TimeCharts';
import { CustomText, displayNotification } from '../../../components';
import { MinusCircleOutlined, PlusCircleOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import './Calculator.css';

const Calculator = () =>
{
    const [step,setStep] = useState(1);
    const [signalsIn,setSignalsIn] = useState(1);
    const [signalsOut,setSignalsOut] = useState(1);
    const [disabled,setDisabled] = useState(false);
    const [mappedLabelsIn,setMappedLabelsIn]=useState([]);
    const [mappedLabelsOut,setMappedLabelsOut]=useState([]);
    const {clearSignalContext,areSignalsCorrect,addArray,deleteArray} = React.useContext(SignalContext);
    const {checkSolvable,calculateTableValues,solvable,solveTable,calculationStatus,additionalSignals,clearTableContext} = useContext(TableContext);


    const onFinish = ({sigIn,sigOut}) =>
    {

        if(sigOut > sigIn)
        {
            displayNotification('error','Błąd','Niedozwolona ilość sygnałów wyjściowych. Prawdopodobnie podano większą wartość niż ilość sygnałów wejściowych');
            return;
        }

        setSignalsIn(sigIn);
        const labelsIn = signalLabels('in',sigIn);

        setSignalsOut(sigOut);
        const labelsOut = signalLabels('out',sigOut);
        
        setStep(2);

        clearSignalContext();

        setMappedLabelsIn(labelsIn.map(li=>
            {
                addArray({data:[/*{x:0,y:0},{x:1,y:0}*/],label:li,sigType:'in'});
                return <TimeChart disabled={disabled} key={li} label={li} sigType='in'/>
        }));

        setMappedLabelsOut(labelsOut.map(lo=>
            {
                addArray({data:[/*{x:0,y:0},{x:1,y:0}*/],label:lo,sigType:'out'});
                return <TimeChart disabled={disabled} key={lo} label={lo} sigType='out'/>
            }));

    }

    const handleChartButton = (type,signal) =>
    {
        if(type === 'add')
        {
            if(signal === 'in')
            {
                const signals = signalsIn
                setSignalsIn(signals+1);
                const labels = [...mappedLabelsIn];
                const arr = signalLabels('in',signals+1);
                const label = arr[arr.length-1];
                labels.push(<TimeChart disabled={disabled} key={label} label={label} sigType='in'/>);
                addArray({data:[/*{x:0,y:0},{x:1,y:0}*/],label:label,sigType:'in'});
                setMappedLabelsIn(labels); 
            }
            else if(signal === 'out')
            { 
                const signals = signalsOut
                setSignalsOut(signals+1);
                const labels = [...mappedLabelsOut];
                const arr = signalLabels('out',signals+1);
                const label = arr[arr.length-1];
                labels.push(<TimeChart disabled={disabled} key={label} label={label} sigType='out'/>);
                addArray({data:[/*{x:0,y:0},{x:1,y:0}*/],label:label,sigType:'out'});
                setMappedLabelsOut(labels); 
            };
        }
        else if(type === 'delete')
        {
            if(signal === 'in')
            {
                const signals = signalsIn
                setSignalsIn(signals-1);
                const labels = [...mappedLabelsIn];
                labels.pop();
                deleteArray('in');
                setMappedLabelsIn(labels);
            }
            else if(signal === 'out')
            {
                const signals = signalsOut
                setSignalsOut(signals-1);
                const labels = [...mappedLabelsOut];
                labels.pop();
                deleteArray('out');
                setMappedLabelsOut(labels);
            }
        }
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
                            <InputNumber min={1} max={MAX_SIGNALS}/>
                        </Form.Item>
                        <Form.Item
                            label='Sygnały Wyjściowe'
                            name='sigOut'
                            rules={[{ required: true, message: 'Proszę podać liczbę sygnałów wyjściowych' }]}
                        >
                            <InputNumber min={1} max={MAX_SIGNALS}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type='primary' htmlType='submit'>Dalej</Button>
                        </Form.Item>
                </Form>
            )}
            {step > 1 && (
                <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'stretch'}}>
                    <CustomText strong size={13} style={{marginBottom:5}}>
                        Proszę uzupełnić przebiegi czasowe. Jeżeli sygnał wejściowy wpływa bezpośrednio na sygnał wyjścia to zmiany
                        muszą być zaznaczone w tym samym punkcie na wykresach. Kliknięcie na punkt wykresu spowoduje przeniesienie wskaźnika.   
                    </CustomText>
                    <CustomText strong size={14} style={{marginBottom:10}}>
                        Przyciski: ↑ powoduje sygnał dodatni, ↓ ujemny, × czyści wykres, a ↶ cofa zmianę.
                    </CustomText>
                    <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                        <Card title='Sygnały Wejściowe' className='signalCard' bordered={false} style={{width: '40%',padding:'0 0'}}>
                            <div style={{display:'flex',justifyContent:'center'}}>
                                <div style={{display:'flex',justifyContent:'space-around',width:'20%'}}>
                                    {(signalsIn > 1 && signalsOut < signalsIn)&& <Button size='small' icon={<MinusCircleOutlined/>} shape='circle' onClick={()=>handleChartButton('delete','in')} />}
                                    {signalsIn < MAX_SIGNALS && <Button size='small' icon={<PlusCircleOutlined/>} shape='circle' onClick={()=>handleChartButton('add','in')}/>}
                                </div>
                            </div>
                            {
                                mappedLabelsIn
                            }
                        </Card>
                        <Card title='Sygnały Wyjściowe' className='signalCard' bordered={false} style={{width: '40%',paddingBottom: 10}}>
                            <div style={{display:'flex',justifyContent:'center'}}>
                                <div style={{display:'flex',justifyContent:'space-around',width:'20%'}}>
                                    {signalsOut > 1 && <Button size='small' icon={<MinusCircleOutlined/>} shape='circle' onClick={()=>handleChartButton('delete','out')} />}
                                    {(signalsOut < MAX_SIGNALS && signalsOut < signalsIn) && <Button size='small' icon={<PlusCircleOutlined/>} shape='circle' onClick={()=>handleChartButton('add','out')}/>}
                                </div>
                            </div>
                            {
                                mappedLabelsOut
                            }
                        </Card>
                    </div>
                    {step === 2 && (
                        <div style={{display:'flex',justifyContent:'center'}}>
                            <div style={{display:'flex',justifyContent:'space-around',minWidth: 250}}>
                                <Button size='small' type='primary' onClick={()=>{
                                setStep(1);
                                clearSignalContext();
                                }}>
                                    Powrót
                                </Button>
                                <Popconfirm 
                                    title='Uwaga! Kliknięcie dalej spowoduje automatyczne uzupelnienie sygnałów do stanu początkowego. Kontynuować?' 
                                    okText="Tak"
                                    cancelText="Nie"
                                    icon={<QuestionCircleOutlined style={{ color: 'orange' }} />}
                                    onCancel={()=>{}}
                                    onConfirm={()=>{
                                        const {length,inArrays,outArrays,correct} = areSignalsCorrect(signalsIn,signalsOut);
                                        if(!correct)
                                        {
                                            displayNotification('error','Błąd','Wystąpił błąd, prawdobodobnie wystąpił wykres bez żadnych sygnałów');
                                            return;
                                        }
                                        const {dependencies,nsuArray} = calculateTableValues(length,inArrays,outArrays);
                                        setDisabled(true);
                                        checkSolvable({dependencyArray:dependencies,nsuArray},[],true);
                                        setStep(3);
                                    }}
                                >
                                    <Button size='small' type='primary'>
                                        Dalej
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    )}
                    {step > 2 && (
                        <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center'}}>
                            <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center',padding: 10}}>
                                <CustomText strong size={18} style={{marginBottom:20}} >Na podstawie podanych sygnałów wygenerowano poniższą TKŁ:</CustomText>
                                <ConnectionOrderTable initial={true} signalsIn={signalsIn} signalsOut={signalsOut}/>
                            </div>
                            {step === 3 && (
                                <div style={{display:'flex',justifyContent:'center', padding: 20}}>
                                    <div style={{display:'flex',justifyContent:'center',minWidth: 250}}>
                                        {/* <Button type='primary' onClick={()=>{
                                        setStep(2);
                                        }}>
                                        Powrót
                                        </Button> */}
                                        {   solvable ? 
                                            <Button type='primary' onClick={()=>{
                                                setStep(1);
                                                clearSignalContext();
                                            }}>
                                                Powrót na początek
                                            </Button> :
                                            <Button type='primary' onClick={()=>{
                                                setStep(4);
                                                solveTable();
                                            }}>
                                                Rozwiąż TKŁ
                                            </Button>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {step > 3 && (
                        <>
                        <div>
                            {(calculationStatus === STATUS.LOADING || calculationStatus === STATUS.IDLE) && (<Spin tip='Obliczanie...' size='large'/>)}
                        </div>
                        <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center'}}>
                            <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center',padding: 10}}>
                                <CustomText strong size={18} style={{marginBottom:20}} >Wyznaczono granice i zaproponowano sposób kodowania:</CustomText>
                                <ConnectionOrderTable initial={true} showBorders={true} signalsIn={signalsIn} signalsOut={signalsOut}/>
                            </div>
                            {step === 4 && (
                            <div style={{display:'flex',justifyContent:'center', padding: 20}}>
                                <div style={{display:'flex',justifyContent:'center',minWidth: 250}}>
                                    <Button type='primary' onClick={()=>{
                                    setStep(5);
                                }}>
                                    Wygeneruj TKŁ
                                </Button>
                                </div>
                            </div>
                            )}
                        </div>
                        </>
                    )}
                    {step > 4 && (
                        <>
                        <div>
                            {(calculationStatus === STATUS.LOADING || calculationStatus === STATUS.IDLE) && (<Spin tip='Obliczanie...' size='large'/>)}
                        </div>
                        <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center'}}>
                            <div style={{display:'flex',flexDirection:'column',width:'100%', alignItems: 'center',padding: 10}}>
                                <CustomText strong size={18} style={{marginBottom:20}} >Wygenerowano poniższą tablicę przy pomocy algorytmu:</CustomText>
                                <ConnectionOrderTable initial={false} signalsIn={signalsIn} signalsOut={signalsOut}/>
                            </div>
                            <div style={{display:'flex',justifyContent:'center', padding: 20}}>
                                <div style={{display:'flex',justifyContent:'center',minWidth: 250}}>
                                    <Button type='primary' onClick={()=>{
                                    setStep(1);
                                    clearSignalContext();
                                    clearTableContext();
                                }}>
                                    Powrót na początek
                                </Button>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>    
            )}
        </div>
    )
}



export default Calculator;