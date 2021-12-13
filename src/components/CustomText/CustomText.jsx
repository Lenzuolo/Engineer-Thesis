import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const CustomText = ({size,strong,children,style}) =>{

    return ( <Text strong={strong} style={{fontSize:size,...style}}>{children}</Text>);
}

export default CustomText;