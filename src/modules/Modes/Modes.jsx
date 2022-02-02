import React from 'react';
import { MODES } from '../../utils';
import { Empty } from 'antd';
import Calculator from './Calculator';
import ArticlePage from './ArticlePage';

const Modes = ({modeId}) =>
{
    switch(modeId)
    {
        case MODES.HuffmanExamples:
            return (<Empty description='Tu beda przyklady Huffmana'/>);
        case MODES.HuffmanTheory:
            return (<ArticlePage path='/Huffman - Teoria.pdf'/>);
        case MODES.SequentialTheory:
            return (<ArticlePage path={'/Układy sekwencyjne.pdf'}/>);
        case MODES.SiwinskiCalculate:
            return (<Calculator/>);
        case MODES.SiwinskiExamples:
            return (<ArticlePage path={'/TKŁ - Przykłady.pdf'}/>);
        case MODES.SiwinskiTheory:
            return (<ArticlePage path={'/TKŁ - Teoria.pdf'}/>);
        default:
            return (<Empty description='Wybrano niewłaściwą opcję'/>);
    }
} 

export default Modes;