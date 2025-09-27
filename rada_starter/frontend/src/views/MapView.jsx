import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Button } from 'antd'

export default function MapView() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // placeholder: fetch events from API
    setEvents([
    { id: 1, title: 'Street Food Pop-up', distance: '0.4 km', timeLeft: '2 hr' },
    { id: 2, title: 'Open Mic Night', distance: '0.9 km', timeLeft: '5 hr' },
    { id: 3, title: 'Tech Meetup', distance: '1.2 km', timeLeft: '1 hr' },
    { id: 4, title: 'Live Jazz Concert', distance: '2.0 km', timeLeft: '3 hr' },
    { id: 5, title: 'Pop-up Art Gallery', distance: '1.8 km', timeLeft: '6 hr' },
    { id: 6, title: 'Fitness Bootcamp', distance: '0.5 km', timeLeft: '4 hr' },
    { id: 7, title: 'Poetry Slam', distance: '2.5 km', timeLeft: '7 hr' },
    { id: 8, title: 'Outdoor Movie Night', distance: '3.0 km', timeLeft: '8 hr' },
    { id: 9, title: 'Farmers Market', distance: '1.0 km', timeLeft: '1.5 hr' },
    { id: 10, title: 'Photography Walk', distance: '0.7 km', timeLeft: '2.5 hr' },
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