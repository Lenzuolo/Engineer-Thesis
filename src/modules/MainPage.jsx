import React, { useState } from 'react';
import { Layout, Menu, Card, Button } from 'antd';
import { Topbar,Footer } from '../components';
import Modes from './Modes';
import './home.css';

const { Content,Sider } = Layout;
const { SubMenu } = Menu;

const MainPage = () =>
{
    const [selectedMode,setSelectedMode] = useState('Kalkulator TKŁ');

    return (
        <Layout style={{minHeight:'100vh'}}>
            <Topbar setMode={setSelectedMode}/>
            <Layout>
                <Sider style={{width:200,overflow:'auto',minHeight:850}}>
                    <Menu
                        theme='dark'
                        mode='inline'
                        style={{height:'100%',paddingTop:10}}
                        onClick={({key})=>setSelectedMode(key)}
                        defaultSelectedKeys={[selectedMode]}
                        selectedKeys={[selectedMode]}
                    >
                        <Menu.Item key='Układy Sekwencyjne'>Układy Sekwencyjne</Menu.Item>
                        <SubMenu key='siwinski' title='Metoda Siwińskiego'>
                            <Menu.Item key='TKŁ - Teoria'>Teoria</Menu.Item>
                            <Menu.Item key='TKŁ - Przykłady'>Przykłady</Menu.Item>
                            <Menu.Item key='Kalkulator TKŁ'>Kalkulator TKŁ</Menu.Item>
                        </SubMenu>
                        <SubMenu key='huffman' title='Metoda Huffmana'>
                            <Menu.Item key='Metoda Huffmana - Teoria'>Teoria</Menu.Item>
                            <Menu.Item key='Metoda Huffmana - Przykłady'disabled>Przykłady</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content>
                        <Card
                            title={selectedMode || ''}
                            className='panel-main-card'
                        >
                        {selectedMode && <Modes modeId={selectedMode}/>}
                        </Card>
                    </Content>
                </Layout>
            </Layout>
            <Footer/>
        </Layout>
    );

}

export default MainPage;