 function edgeDetector(arg1,arg2)
{
    return (arg1.y === 0 && arg2.y === 1) || (arg1.y === 1 && arg2.y === 0);
}

function findMaxLength(arr)
{
    const lengthArray = [];
    arr.forEach(a=>
        {
            lengthArray.push(a.data.length);
        });
    return Math.max.apply(null,lengthArray);
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

    static ContinueSignal(signalArray,data,label)
    {
        const currentMaxLength = findMaxLength(signalArray);
        if(currentMaxLength > data.length)
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
                    const diff = data.length - currLength;
                    const lastElem = signalArray[i].data[currLength-1];
                    for(let j=0;j<diff;j++)
                    {
                        signalArray[i].data.push({x:lastElem.x + 1, y:lastElem.y});
                    }
                }
            }
            return signalArray;
        }
    }

}

export default SignalService;