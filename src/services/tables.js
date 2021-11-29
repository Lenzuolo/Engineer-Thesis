function edgeDetector(arg1,arg2)
{
    if(arg1.y === 0 && arg2.y === 1)
    {
        return {detected: true, type:'rising'}
    }
    else if(arg1.y === 1 && arg2.y === 0)
    {
        return {detected: true, type: 'falling'}
    }
    else return {detected: false, type: ''};
}


class TableService
{
    static calculateTacts(signalArray)
    {
        let changesArray = [];
        signalArray.forEach(sig=>{
            let signalChange = {rising: [],falling: []};
            for(let i = 0; i < sig.data.length - 1; i++)
            {
                const {detected,type} = edgeDetector(sig.data[i],sig.data[i+1]);
                if(detected)
                {
                    if(type==='rising'){
                        signalChange.rising.push(i);
                    }
                    else if(type==='falling')
                    {
                        signalChange.falling.push(i);
                    }
                }
            }
            changesArray.push({label:sig.label,signalChange});
        });
        
        let tacts = 0;
        changesArray.forEach(c=>{
            tacts += c.signalChange.rising.length + c.signalChange.falling.length;
        });

        return {tacts:tacts,changes:changesArray};
    }
    static calculateNSU(changes,tact)
    {
        
    }
}

export default TableService;