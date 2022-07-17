import { useState, useEffect } from "react"
import { Button, Col, Layout, Menu, Row } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import Link from "next/link"
import { useRouter } from "next/router"
import "antd/dist/antd.css"

import { useAuth } from '../contexts/authProvider'
import styled from "styled-components"

const LayoutContainer = styled(Layout)`
  height: 100%;
`

const MainHeader = styled(Header)`
  background-color: white;
`

const LayoutContent = styled(Content)`
  padding: 24px 48px;
`

const defaultSelectedKey = 'main'

const MainLayout = ({ children }) => {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [selectedKey, setSelectedKey] = useState(defaultSelectedKey)

  const handleSignOut = () => {
    signOut()
    router.push('/', undefined, { shallow: true })
  }

  const handleSelect = ({ key }) => {
    setSelectedKey(key)
  }

  useEffect(() => {
    if (!user) {
      handleSignOut()
      setSelectedKey(defaultSelectedKey)
    }
    else {
      const idx = router.pathname.indexOf('/')
      setSelectedKey(router.pathname.slice(idx + 1))
    }
  }, [user])

  return (
    <LayoutContainer className="layout">
      {user && 
        <MainHeader className="header">
          <Row justify="space-between">
            <Col>
              <Menu 
                mode="horizontal" 
                overflowedIndicator={false} 
                defaultSelectedKeys={[defaultSelectedKey]}
                selectedKeys={[selectedKey]}
                onClick={handleSelect}
              >
                <Menu.Item key='main'>
                  <Link href="/main">
                    FMP
                  </Link>
                </Menu.Item>
              </Menu>
            </Col>
            <Col>
              <Menu mode="horizontal" overflowedIndicator={false}>
                <Menu.Item key='user_email'>
                  {user?.email}
                </Menu.Item>
                <Menu.Item key='user_logout'>
                  <Button type="text" onClick={handleSignOut}>Log out</Button>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
        </MainHeader>
      }
      <LayoutContent>
        {children}
      </LayoutContent>
      <Footer style={{ textAlign: 'center' }}>Meal Planner ©2022 Created by Shinji Furuya</Footer>
    </LayoutContainer>
  )
}

export default MainLayout
