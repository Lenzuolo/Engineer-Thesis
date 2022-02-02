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

function findLastEdge(arr)
{
    let index = 0;
    for(let i = 0; i < arr.length-1;i++)
    {
        if(edgeDetector(arr[i],arr[i+1]))
        {
            index = i + 1;
        }
    }
    return index;
}

function findMostRecentSignalChange(arrays)
{
    let index = 0;
    arrays.forEach(a=>{
        let i = findLastEdge(a.data);
        if(i > index)
        {
            index = i;
        }
    })

    return index;
}
class SignalService
{

    static CheckSignals(signalArray,data,label)
    {
        if(!data || label.includes('Q'))
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

    static fillWithStartState(inArrays,outArrays)
    {
        const signals = [...inArrays,...outArrays];
        const index = findMostRecentSignalChange(signals);

        inArrays.forEach(i=>{
            const data = i.data;
            if(data[index].y !== data[0].y)
            {
                for(let j = index; j < data.length;j++)
                {
                    data[j].y = data[0].y;
                }
            }
        });

        outArrays.forEach(o=>{
            const data = o.data;
            if(data[index].y !== data[0].y)
            {
                for(let j = index; j < data.length;j++)
                {
                    data[j].y = data[0].y;
                }
            }
        });

        return {inArrays,outArrays};
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