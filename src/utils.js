
export const MODES = 
{
    SiwinskiTheory: 'TKŁ - Teoria',
    SiwinskiExamples: 'TKŁ - Przykłady',
    SiwinskiCalculate: 'Kalkulator TKŁ',
    HuffmanTheory: 'Metoda Huffmana - Teoria',
    HuffmanExamples: 'Metoda Huffmana - Przykłady',
    SequentialTheory: 'Układy Sekwencyjne',
};

export const LABELS_IN = [
    'X0','X1','X2','X3','X4'
];

export const LABELS_OUT = [
    'Q0','Q1','Q2','Q3','Q4'
];

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
