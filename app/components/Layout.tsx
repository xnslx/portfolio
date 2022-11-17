import type {PropsWithChildren} from 'react'

import Footer from './Footer'
import Header from './Header'

export default function Layout(props: PropsWithChildren) {
  const {children} = props

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 lg:p-12">{children}</div>
      <Footer />
    </>
  )
}
