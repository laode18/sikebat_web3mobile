import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooterketua = () => {
  return (
    <CFooter>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Copyright
        </a>
        <span className="ms-1">&copy; 2023 SIM Kelurahan.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          La Ode &amp; Neisha
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooterketua)
