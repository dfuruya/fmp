import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Auth, Card, Typography, Space } from '@supabase/ui'

import { supabase } from '../lib/initSupabase'
import { useAuth } from '../contexts/authProvider'

const Index = () => {
  const router = useRouter()
  const [authView, setAuthView] = useState('sign_in')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/main', undefined, { shallow: true })
    }
  }, [user])

  if (!user)
    return (
      <div style={{ maxWidth: '420px', margin: '96px auto' }}>
        <Card>
          <Space direction="vertical" size={8}>
            <div>
              <img
                src="https://app.supabase.io/img/supabase-dark.svg"
                width="96"
              />
              <Typography.Title level={3}>
                Welcome to Supabase Auth
              </Typography.Title>
            </div>
            <Auth
              supabaseClient={supabase}
              providers={['google', 'github']}
              view={authView}
              socialLayout="horizontal"
              socialButtonSize="xlarge"
            />
          </Space>
        </Card>
      </div>
    )

  // TODO: beter Loading screen
  return (
    <div>Loading...</div>
  )
}

export default Index
