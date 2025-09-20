import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Button } from 'antd'

export default function MapView() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // placeholder: fetch events from API
    setEvents([
      { id: 1, title: 'Street Food Pop-up', distance: '0.4 km', timeLeft: '2 hr' },
      { id: 2, title: 'Open Mic Night', distance: '0.9 km', timeLeft: '5 hr' }
    ])
  }, [])

  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Card title="Events nearby">
          <List
            dataSource={events}
            renderItem={item => (
              <List.Item actions={[<Button key='view'>View</Button>]}>
                <List.Item.Meta title={item.title} description={`${item.distance} • ${item.timeLeft}`} />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col xs={24} md={16}>
        <Card style={{ height: '70vh' }}>
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
            Map Placeholder (Integrate Google Maps JS or Leaflet here)
          </div>
        </Card>
      </Col>
    </Row>
  )
}