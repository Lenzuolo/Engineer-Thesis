import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Topbar,Footer } from '../components';
import './home.css';

const { Content,Sider } = Layout;
const { SubMenu } = Menu;

const MainPage = () =>
{
    const [selectedMode,setSelectedMode] = useState();

    return (
        <Layout style={{minHeight:'100vh'}}>
            <Topbar/>
            <Layout>
                <Sider style={{width:200,overflow:'auto',minHeight:850}}>
                    <Menu
                        theme='dark'
                        mode='inline'
                        style={{height:'100%',paddingTop:10}}
                        onClick={({key})=>setSelectedMode(key)}
                    >
                        <Menu.Item key='sequential'>Układy Sekwencyjne</Menu.Item>
                        <SubMenu key='siwinski' title='Metoda Siwińskiego'>
                            <Menu.Item key='theoryTKL'>Teoria</Menu.Item>
                            <Menu.Item key='examplesTKL' disabled>Przykłady</Menu.Item>
                            <Menu.Item key='calculateTKL'>Kalkulator TKŁ</Menu.Item>
                        </SubMenu>
                        <SubMenu key='huffman' title='Metoda Huffmana'>
                            <Menu.Item key='theoryHuff'>Teoria</Menu.Item>
                            <Menu.Item key='examplesHuff' disabled>Przykłady</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content>
                    </Content>
                </Layout>
            </Layout>
            <Footer/>
        </Layout>
    );

}

export default MainPage;