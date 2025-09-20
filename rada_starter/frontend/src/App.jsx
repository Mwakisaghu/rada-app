import React from 'react'
import { Layout } from 'antd'
import MapView from './views/MapView'
import './styles.css'

const { Header, Content } = Layout

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: 20 }}>Rada...?</Header>
      <Content style={{ padding: '16px' }}>
        <MapView />
      </Content>
    </Layout>
  )
}