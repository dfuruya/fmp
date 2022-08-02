import { useState, useEffect } from "react"
import { Button, Col, Layout, Menu, Row } from "antd"
import { Content, Footer, Header } from "antd/lib/layout/layout"
import Link from "next/link"
import { useRouter } from "next/router"
import "antd/dist/antd.css"

import { useAuth } from '../contexts/authProvider'
import styled from "styled-components"

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
    <Layout className="layout">
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
                items={[
                  {
                    key: 'main', 
                    label: (
                      <Link href="/main">
                        FMP
                      </Link>
                    )
                  },
                ]}
              />
            </Col>
            <Col>
              <Menu 
                mode="horizontal" 
                overflowedIndicator={false}
                items={[
                  {
                    key: 'user_logout', 
                    label: (
                      <Button type="text" onClick={handleSignOut}>Log out</Button>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </MainHeader>
      }
      <LayoutContent>
        {children}
      </LayoutContent>
      <Footer style={{ textAlign: 'center' }}>Meal Planner ©2022 Created by Shinji Furuya</Footer>
    </Layout>
  )
}

export default MainLayout
