import './Home.css'
import Header from './Header'
import Sidebar from './Sidebar'

function Home({user}) {

    return (
    <div className="home">
        <Header></Header>
        <Sidebar></Sidebar>
    </div>
    )
}

export default Home