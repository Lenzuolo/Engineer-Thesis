import React, { useCallback, useState} from 'react';
import { findMaxLength, SignalService } from '../services';

const defaultState = () =>(
{
    inArrays: [],
    outArrays: [],
    arrayChanged: false,
    length: 0,
});

const SignalContext = React.createContext(defaultState());

const SignalContextProvider = ({children}) =>
{
    const [state,setState] = useState(defaultState());

    const addArray = useCallback(({data,label,sigType})=>
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
        if(signalArrayString === null)
        {
            const newArr = [{data: data, label: label}];
            const newState = {...state,[arrName]:newArr};
            setState(newState);
            localStorage.setItem(arrName,JSON.stringify(newArr));
            return;
        }
        const signalArray = JSON.parse(signalArrayString);
        if(signalArray.find(arr=>arr.label === label))
        {
            updateArray({data,label,sigType});
            return;
        }
        signalArray.push({data: data, label: label});
        localStorage.setItem(arrName,JSON.stringify(signalArray));
        const newState = {...state,[arrName]:signalArray};
        setState(newState);
        return;
    },[state]);


    const updateArray = useCallback(({data,label,sigType},undo)=>{
        
        
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
            signalArray = SignalService.ContinueSignal(signalArray,data,label,undo);
            localStorage.setItem(arrName,JSON.stringify(signalArray));
            const newState = {...state,[arrName]:signalArray,arrayChanged:!state.arrayChanged};
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
                return false;
            }
        const signalArray = [...state.inArrays,...state.outArrays];
        const length = findMaxLength(signalArray);
        setState({...state,length:length});
        if(length === 0){
            return false;
        }
        return {correct:signalArray.every(arr=> arr.data.length === length),length:length};
    },[state]);

    return (
        <SignalContext.Provider value={{ ...state, addArray, updateArray, clearSignalContext, areSignalsCorrect, deleteArray }}>
          {children}
        </SignalContext.Provider>
      );
};

export {SignalContext,SignalContextProvider};

