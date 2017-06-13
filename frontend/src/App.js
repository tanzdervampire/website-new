import React from 'react';
import theme from './toolbox/theme';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

import './toolbox/theme.css';

const App = () => (
    <ThemeProvider theme={theme}>
        <div>
            <h2>Hello, World!</h2>
        </div>
    </ThemeProvider>
);

export default App;
