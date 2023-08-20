import './Header.css'

function Header() {

  function showSidebar() {
    const sidebar = document.querySelector('.sidebar')
    if(sidebar.classList.contains('sidebar_hide')){
      sidebar.classList.remove('sidebar_hide')
    }
    else{
      sidebar.classList.add('sidebar_hide')
    }
  }

  return (
    <div className="header">
      <img src="/icons/burger_menu.svg" alt="search" onClick={showSidebar}/>
      <span id="main">Amplify Scaling</span><span id="detail">Lead Management Software</span>
      <div className="user_icon">
        <span className="user_name">User</span>
        <img src="icons/default_user.png" alt="user"/></div>
    </div>
  )
}

export default Header