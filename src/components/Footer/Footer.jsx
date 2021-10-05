import React from 'react';
import { Layout } from 'antd';

const {Footer: BaseFooter} = Layout;

const Footer = () => 
{
    return (
        <BaseFooter style={{whiteSpace:'pre-wrap',paddingBottom:10,backgroundColor:'lightgray'}}>
            {
            'Projekt zrealizowano dla Politechniki Śląskiej.\nAutor: Leszek Komorowski.\nWszelkie prawa zastrzeżone.'
            }
        </BaseFooter>
    )
}

export default Footer;
