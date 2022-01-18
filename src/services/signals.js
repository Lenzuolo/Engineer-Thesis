 function edgeDetector(arg1,arg2)
{
    return (arg1.y === 0 && arg2.y === 1) || (arg1.y === 1 && arg2.y === 0);
}

function findMaxLength(arr)
{
    if(arr.length === 0){
        return 0;
    }
    const lengthArray = [];
    arr.forEach(a=>
        {
            lengthArray.push(a.data.length);
        });

    const max =  Math.max.apply(null,lengthArray);
    const label = arr.find(a=>a.data.length === max).label;
    return {max,label};
}

class SignalService
{

    static CheckSignals(signalArray,data,label)
    {
        if(!data)
        {
            return false;
        }
        for(let i = 0;i<signalArray.length;i++)
        {
            if(signalArray[i].label !== label)
            {
                const length = signalArray[i].data.length;
                if(length > 1)
                {
                    for(let j = 0; (j < length-1) && (j < data.length-1);j++)
                    {
                        if(edgeDetector(signalArray[i].data[j],signalArray[i].data[j+1]) &&
                            edgeDetector(data[j],data[j+1]))
                            {
                                return true;
                            }
                    }
                }
            }
        }
        return false;
    }

    static ContinueSignal(signalArray,data,label,undo)
    {
        const currentMaxLength = findMaxLength(signalArray);
        if(!undo)
        {
            if(currentMaxLength.max > 1)
            {
                if(currentMaxLength.max > data.length)
                {
                    return signalArray;
                }
                else
                {
                    for(let i = 0; i < signalArray.length;i++)
                    {
                        if(signalArray[i].label !== label)
                        {
                            const currLength = signalArray[i].data.length;
                            if(currLength > 0)
                            {
                                const diff = data.length - currLength;
                                const lastElem = signalArray[i].data[currLength-1];
                                for(let j=1;j<=diff;j++)
                                {
                                    signalArray[i].data.push({x:lastElem.x + j, y:lastElem.y});
                                }
                            }
                        }
                    }
                    return signalArray;
                }
            }
            else
            {
                return signalArray;
            }
        }
        else
        {
            signalArray.forEach((s)=>
            {
                if(s.label !== label)
                {
                    const currLength = s.data.length;
                    const diff = Math.abs(data.length - currLength);
                    for(let i = 0; i < diff;i++)
                    {
                        s.data.pop();
                    }
                }
            });
            return signalArray;
        }
    }

    static fillWithStartState(inArrays,outArrays,length,dominating)
    {
        let updatedLength;
        if(dominating === 'in')
        {
            inArrays.forEach(i=>
                {
                    const arrLength = i.data.length;
                    const diff = length-arrLength;
                    const lastElem = i.data[arrLength-1];
                    if(diff===0 && lastElem.y !== i.data[0].y)
                    {
                        i.data.push({x:lastElem.x+1,y:i.data[0].y});
                        this.ContinueSignal(inArrays,i.data,i.label,false);
                    }
                    for(let j = 0; j < diff;j++)
                    {
                        i.data.push({x:lastElem.x+1,y:i.data[0].y});
                    }
                });
        
                updatedLength = findMaxLength([...inArrays,...outArrays]);

                outArrays.forEach(o=>
                {
                    const arrLength = o.data.length;
                    const diff = updatedLength.max-arrLength;
                    const lastElem = o.data[arrLength-1];
                    if(diff===0 && lastElem.y !== o.data[0].y)
                    {
                        o.data.push({x:lastElem.x+1,y:o.data[0].y});
                        this.ContinueSignal(inArrays,o.data,o.label,false);
                    }
                    for(let i = 0; i < diff;i++)
                    {
                    o.data.push({x:lastElem.x+1,y:o.data[0].y});
                    }
                });
        
        }
        else
        {
            outArrays.forEach(o=>
                {
                    const arrLength = o.data.length;
                    const diff = length-arrLength;
                    const lastElem = o.data[arrLength-1];
                    if(diff===0 && lastElem.y !== o.data[0].y)
                    {
                        o.data.push({x:lastElem.x+1,y:o.data[0].y});
                        this.ContinueSignal(inArrays,o.data,o.label,false);
                    }
                    for(let i = 0; i < diff;i++)
                    {
                    o.data.push({x:lastElem.x+1,y:o.data[0].y});
                    }
                });

            updatedLength = findMaxLength([...inArrays,...outArrays]);


            inArrays.forEach(i=>
                {
                    const arrLength = i.data.length;
                    const diff = updatedLength.max-arrLength;
                    const lastElem = i.data[arrLength-1];
                    if(diff===0 && lastElem.y !== i.data[0].y)
                    {
                        i.data.push({x:lastElem.x+1,y:i.data[0].y});
                        this.ContinueSignal(inArrays,i.data,i.label,false);
                    }
                    for(let j = 0; j < diff;j++)
                    {
                        i.data.push({x:lastElem.x+1,y:i.data[0].y});
                    }
                });
        }


        return {inArrays,outArrays,updatedLength:updatedLength.max};
    }

    static isSequentialCircuit(inArray,outArray,length)
    {
        let isSequentialCircuit = false;
        const states = []
        for(let i = 0; i<length;i++)
        {
            let inState = [], outState = [];
            inArray.forEach(n=>{
                inState.push(n.data[i].y.toString());
            });
            outArray.forEach(n=>{
                outState.push(n.data[i].y.toString());
            })

            states.push({state:i,in:inState.join(''),out:outState.join('')});
        }
        // eslint-disable-next-line no-debugger
        debugger;
        states.forEach(s=>{
            const filtered = states.filter(f=>f.in === s.in);
            if(filtered.some(f=> f.out !== s.out))
            {
                isSequentialCircuit = true;
            }
        })

        return isSequentialCircuit;
    }
}

export {SignalService,findMaxLength};