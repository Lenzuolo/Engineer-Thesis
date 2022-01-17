import React from 'react';
import { Card } from 'antd';


const ArticlePage = ({path}) =>
{
    return (
        <div>
            <Card
                style={{minWidth:1200,minHeight:1000}}
                headStyle={{textAlign:'left'}}
                bordered={false}
            >
                <div style={{
                    minHeight: 600,
                    maxHeight: 1200,
                    overflowY: 'auto',
                    marginTop: 4,
                    marginBottom: 8,
                    border: '5px inset #eee',
                }}>
                    <object
                        width="100%"
                        style={{ height: '125vh' }}
                        data={process.env.PUBLIC_URL+path}
                        type="application/pdf">
                        <embed src={process.env.PUBLIC_URL+path} type="application/pdf" />
                    </object>
                </div>
            </Card>
        </div>
    )
}

export default ArticlePage;