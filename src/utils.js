
export const MODES = 
{
    SiwinskiTheory: 'TKŁ - Teoria',
    SiwinskiExamples: 'TKŁ - Przykłady',
    SiwinskiCalculate: 'Kalkulator TKŁ',
    HuffmanTheory: 'Metoda Huffmana - Teoria',
    HuffmanExamples: 'Metoda Huffmana - Przykłady',
    SequentialTheory: 'Układy Sekwencyjne',
};

export const uniqNSU = (arr) =>{
    let seen = {};
    let out = [];
    let len = arr.length;
    let j = 0;
    for(var i = 0; i < len; i++) {
         var item = arr[i].NSU;
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}

export const signalLabels = (label,amount) =>
{
    let symbol = label === 'in' ? 'X' : label === 'out' ? 'Q' : 'Z';
    let array = [];
    for(let i = 0;i<amount;i++)
    {
        array.push(`${symbol}${i}`);
    }

    return array;
}

export const STATUS = {
    LOADING: 'loading',
    FINISHED: 'finished',
    IDLE: 'idle'
}
