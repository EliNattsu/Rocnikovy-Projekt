function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}

function setupMenuListeners(){
    const sidebar = document.querySelector('.sidebar');
    const menuItems = sidebar.querySelectorAll('a');

    menuItems.forEach(item => {
        item.addEventListener('click', hideSidebar);
    });
}
document.addEventListener('DOMContentLoaded', setupMenuListeners);

