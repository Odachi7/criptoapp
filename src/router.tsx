import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home";
import { Datail } from "./pages/Datail";
import { Notfound } from "./pages/Notfound";
import { Layout } from "./components/Layout";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/detail/:cripto",
                element: <Datail/>
            },
            {
                path: "*",
                element: <Notfound/>
            }
        ]
    }
])

export { router }