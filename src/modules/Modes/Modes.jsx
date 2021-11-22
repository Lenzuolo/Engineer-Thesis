import React from 'react';
import { MODES } from '../../utils';
import { Empty } from 'antd';
import Calculator from './Calculator';

const Modes = ({modeId}) =>
{
    switch(modeId)
    {
        case MODES.HuffmanExamples:
            return (<Empty description='Tu beda przyklady Huffmana'/>);
        case MODES.HuffmanTheory:
            return (<Empty description='Tu bedzie teoria z Huffmana'/>);
        case MODES.SequentialTheory:
            return (<Empty description='Tu bedzie teoria z ukladow sekwencyjnych'/>);
        case MODES.SiwinskiCalculate:
            return (<Calculator/>);
        case MODES.SiwinskiExamples:
            return (<Empty description='Tu beda przyklady z TKŁ'/>);
        case MODES.SiwinskiTheory:
            return (<Empty description='Tu będzie teoria z TKŁ'/>);
        default:
            return (<Empty description='Wybrano niewłaściwą opcję'/>);
    }
} 

export default Modes;