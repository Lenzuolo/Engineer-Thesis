import React, { useCallback, useState} from 'react';
import { SignalService } from '../services';

const defaultState = () =>(
{
    inArrays: [],
    outArrays: [],
    arrayChanged: false,
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
            const newState = {...state,[arrName]:newArr,arrayChanged:!state.arrayChanged};
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
        const newState = {...state,[arrName]:signalArray,arrayChanged:!state.arrayChanged};
        setState(newState);
        return;
    },[state]);


    const updateArray = useCallback(({data,label,sigType})=>{
        
        
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
            signalArray = SignalService.ContinueSignal(signalArray,data,label);
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

    const clearSignalContext = useCallback(()=>
    {
        localStorage.removeItem('inArrays');
        localStorage.removeItem('outArrays');
        setState(defaultState);
    },[])

    return (
        <SignalContext.Provider value={{ ...state, addArray, updateArray, clearSignalContext }}>
          {children}
        </SignalContext.Provider>
      );
};

export {SignalContext,SignalContextProvider};

