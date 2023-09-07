import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import {default as Main} from './containers/MainConatiner';
import Test from './containers';

export const Router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Main />,
            },
            {
                path: '/main',
                element: <Test />,
            },
        ],
    },
]);
