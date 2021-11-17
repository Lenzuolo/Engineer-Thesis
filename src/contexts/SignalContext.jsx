import React, { useCallback, useState} from 'react';
import SignalService from '../services/signals';

const defaultState = () =>(
{
    inArrays: localStorage.getItem('inArrays'),
    outArrays: localStorage.getItem('outArrays'),
});

const SignalContext = React.createContext(defaultState());

const SignalContextProvider = ({children}) =>
{
    const [state,setState] = useState(defaultState());

    const addArray = useCallback(({data,label,sigType})=>
    {
        if(sigType === 'in')
        {
                const inArr = localStorage.getItem('inArrays');
                if(inArr === null)
                {
                    const newArr = [{data: data, label: label}];
                    localStorage.setItem('inArrays',JSON.stringify(newArr));
                    return;
                }
                const arrayIn = JSON.parse(inArr);
                if(arrayIn.find(arr=>arr.label === label))
                {
                    updateArray({data,label,sigType});
                    return;
                }
                arrayIn.push({data: data, label: label});
                localStorage.setItem('inArrays',JSON.stringify(arrayIn));
                return;
        }
        else if(sigType === 'out')
        {
            const outArr = localStorage.getItem('outArrays');
            if(outArr === null)
            {
                const newArr = [{data: data, label: label}];
                localStorage.setItem('outArrays',JSON.stringify(newArr));
                return;
            }
            const arrayOut = JSON.parse(outArr);
            if(arrayOut.find(arr=>arr.label === label))
            {
                updateArray({data,label,sigType});
                return;
            }
            arrayOut.push({data: data, label: label});
            localStorage.setItem('outArrays',JSON.stringify(arrayOut));
            return;
        }
    },[]);


    const updateArray = useCallback(({data,label,sigType})=>{
        if(sigType === 'in')
        {
            const inArr = localStorage.getItem('inArrays');
            const arrayIn = JSON.parse(inArr);
            if(!SignalService.CheckSignals(arrayIn, data, label))
            {
                arrayIn.forEach(arr => {
                    if(arr.label === label)
                    {
                        arr.data = data;
                        return;
                    }
                });
                localStorage.setItem('inArrays',JSON.stringify(arrayIn));
                return true;
            }
            else
            {
                return false;
            }
        }
        else if(sigType === 'out')
        {
            const outArr = localStorage.getItem('outArrays');
            const arrayOut = JSON.parse(outArr);
            if(!SignalService.CheckSignals(arrayOut, data, label))
            {
                arrayOut.forEach(arr => {
                    if(arr.label === label)
                    {
                        arr.data = data;
                        return;
                    }
                });
                localStorage.setItem('outArrays',JSON.stringify(arrayOut));
                return true;
            }
            else
            {
                return false;
            }
        }
    },[]);

    const clearSignalContext = useCallback(()=>
    {
        localStorage.removeItem('inArrays');
        localStorage.removeItem('outArrays');
        setState(defaultState);
    })

    return (
        <SignalContext.Provider value={{ ...state, addArray, updateArray, clearSignalContext }}>
          {children}
        </SignalContext.Provider>
      );
};

export {SignalContext,SignalContextProvider};

