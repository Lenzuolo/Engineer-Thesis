import React, { useCallback, useState} from 'react';
import { findMaxLength, SignalService } from '../services';
import { MAX_DATA_POINTS } from '../utils';

const defaultState = () =>(
{
    inArrays: [],
    outArrays: [],
    arrayChanged: false,
    length: 0,
    signalsChecked: false
});

const SignalContext = React.createContext(defaultState());

const SignalContextProvider = ({children}) =>
{
    const [state,setState] = useState(defaultState());

    const addArray = useCallback(({label,sigType})=>
    {

        let data = [];
        for(let i = 0; i < MAX_DATA_POINTS; i++)
        {
            data.push({x:i,y:0});
        }

        let arrName;
        switch(sigType)
        {
            case 'in':
                arrName = 'inArrays';
                break;
            case 'out':
                arrName = 'outArrays';
                break;
            default:
                break;
        }

        const signalArrayString = localStorage.getItem(arrName);
        if(signalArrayString === null)
        {
            const newArr = [{data: data, label: label}];
            const newState = {...state,[arrName]:newArr,arrayChanged:!state.arrayChanged};
            setState(newState);
            localStorage.setItem(arrName,JSON.stringify(newArr));
            return;
        }
        const signalArray = JSON.parse(signalArrayString);
        signalArray.push({data: data, label: label});
        localStorage.setItem(arrName,JSON.stringify(signalArray));
        const newState = {...state,[arrName]:signalArray,arrayChanged:!state.arrayChanged};
        setState(newState);
        return;
    },[state]);


    const updateArray = useCallback(({data,label,sigType},undo)=>{     
        let arrName;
        let secondArrName;
        switch(sigType)
        {
            case 'in':
                arrName = 'inArrays';
                secondArrName = 'outArrays';
                break;
            case 'out':
                arrName = 'outArrays';
                secondArrName = 'inArrays';
                break;
            default:
                break;
        }

        const signalArrayString = localStorage.getItem(arrName);
        let signalArray = JSON.parse(signalArrayString);

        if(!SignalService.CheckSignals(signalArray, data, label))
        {
            signalArray.forEach(arr => {
                if(arr.label === label)
                {
                    arr.data = data;
                    return;
                }
            });
            signalArray = SignalService.ContinueSignal(signalArray,data,label,undo,);

            let secondSignalArray = JSON.parse(localStorage.getItem(secondArrName));
            secondSignalArray = SignalService.ContinueSignal(secondSignalArray,data,label,undo,);
            localStorage.setItem(arrName,JSON.stringify(signalArray));
            localStorage.setItem(secondArrName,JSON.stringify(secondSignalArray));
            const newState = {...state,[arrName]:signalArray,[secondArrName]:secondSignalArray,arrayChanged:!state.arrayChanged};
            setState(newState);
            return true;
        }
        else
        {
            return false;
        }

    },[state]);

    const deleteArray = (sigType)=>
    {
        let arrName;
        switch(sigType)
        {
            case 'in':
                arrName = 'inArrays';
                break;
            case 'out':
                arrName = 'outArrays';
                break;
            default:
                break;
        }

        const signalArrayString = localStorage.getItem(arrName);
        if(signalArrayString !== null)
        {
            let signalArray = JSON.parse(signalArrayString);
            signalArray.pop();
            localStorage.setItem(arrName,JSON.stringify(signalArray));
            const newState = {...state,[arrName]:signalArray};
            setState(newState);
        }
    };

    const allSignalsInInitialState = ()=>{
        let signals = [...state.inArrays,...state.outArrays];
        return signals.every(s=>s.data.length > 0 ? s.data[0].y === s.data[s.data.length-1].y : false)
    };

    const clearSignalContext = useCallback(()=>
    {
        localStorage.removeItem('inArrays');
        localStorage.removeItem('outArrays');
        setState(defaultState());
    },[]);

    const areSignalsCorrect = useCallback((signalsIn,signalsOut)=>{
        if(state.inArrays.length !== signalsIn || 
            state.outArrays.length !== signalsOut)
            {
                return {correct:false,reason:'Błąd wykresów, spróbuj wyczyścić dane'};
            }
        const signalArray = [...state.inArrays,...state.outArrays];

        if(signalArray.some(s=>s.data.every(d => d.y === 0))) return {correct:false,reason:'Niektóre wykresy nie posiadają wartości'}
        const {max} = findMaxLength(signalArray);
        if(max === 0){
            return {correct:false,reason: 'Żadne wykresy nie posiadają wartości'};
        }
        const {inArrays,outArrays} = SignalService.fillWithStartState(state.inArrays,state.outArrays);

        if(!SignalService.isSequentialCircuit(inArrays,outArrays,max))
        {
            return {correct: false, reason:'Układ nie jest układem sekwencyjnym'}
        }

        localStorage.setItem('inArrays',JSON.stringify(inArrays));
        localStorage.setItem('outArrays',JSON.stringify(outArrays));
        const changed = !state.arrayChanged;

        setState(prev=>{
            let newState = prev;
            newState.inArrays = inArrays;
            newState.outArrays = outArrays;
            newState.length = max;
            newState.arrayChanged = changed;
            return newState;
        });

        return {inArrays:inArrays,outArrays:outArrays,length:max,correct:true};
    },[state]);


    return (
        <SignalContext.Provider value={{ ...state, addArray, updateArray, clearSignalContext, areSignalsCorrect, deleteArray,allSignalsInInitialState}}>
          {children}
        </SignalContext.Provider>
      );
};

export {SignalContext,SignalContextProvider};

