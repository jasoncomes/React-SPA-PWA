import React from 'react';


// Header - Functional Component with Children Props
const Header = (props) => {
    return (
        <div id="Header">
            <img src="/assets/icon.png" alt="logo" />
            <h1>Chatastrophe</h1>
            {props.children}
        </div>
    );
};

export default Header;