import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Uploads } from "@/components";

function App() {

  return (
    <div className="bg-slate-100 text-slate-700 w-screen  min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route index Component={Home} path="/" />
          <Route Component={Uploads} path="/upload" />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
