//  Will get redirected to this page after login/signup

import React from 'react'
import LeftSide_Panel from '../components/LandingPage_Components/LeftSide_Panel'
import RightSide_Panel from '../components/LandingPage_Components/RightSide_Panel'

function Landing_Page() {
    return (
        <div className='flex space-between'>
            <div>
                <LeftSide_Panel/>
            </div>
            <div>
                <RightSide_Panel/>
            </div>
        </div>
    )
}

export default Landing_Page
