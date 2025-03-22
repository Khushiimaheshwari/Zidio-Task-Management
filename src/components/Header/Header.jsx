import React from 'react'
import Container from '../Container/Container'
import { Link, useNavigate } from 'react-router-dom'

function Header() {

    const navigate = useNavigate();

    return (
        <header className='flex w-full bg-blue-200'>
            <Container>
                <nav className='flex justify-between'>
                    <div>
                        <Link>
                            <img src="" alt="Logo" />
                        </Link>
                    </div>
                    <ul>
                        {/* If not logged In */}
                        <li>
                            <button 
                            onClick={ () => navigate("/login")}>
                                Login
                            </button>
                        </li>

                        {/* If not logged In */}
                        <li>
                            {/* Logout */}
                        </li>
                    </ul> 
                </nav>
            </Container>
        </header>
    )
}

export default Header
