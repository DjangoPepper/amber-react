import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">STEpe v0527-2139 dev a</Navbar.Brand>

            </Container>
        </Navbar>
    );
}

export default Header;