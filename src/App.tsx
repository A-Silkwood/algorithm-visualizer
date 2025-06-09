import '@/styles/App.css'
import Pathfinder from '@/features/path-finding/Pathfinder'

function App() {
    return (
        <>
            <div className="bg-gray-900 h-screen flex justify-center items-center">
                <Pathfinder></Pathfinder>
            </div>
        </>
    )
}

export default App
