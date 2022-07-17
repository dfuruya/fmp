import { AuthProvider } from '../contexts/authProvider'
import MainLayout from '../layout'
import './../style.css'
import "antd/dist/antd.css"

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={'dark'} style={{height: '100vh'}}>
      <AuthProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthProvider>
    </main>
  )
}
