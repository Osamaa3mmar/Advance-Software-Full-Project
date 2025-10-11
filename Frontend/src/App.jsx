import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

export default function App() {
  const router=createBrowserRouter([
    {},
    {},
    {},
    {}
  ]);




  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
