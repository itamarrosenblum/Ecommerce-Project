import './SideBar.css';
import './SideBarQueries.css';
import { useSelector } from 'react-redux';
import AddProduct from './addProduct/AddProduct';
import AddBtn from './addBtn/AddBtn';
import EditProduct from './editProduct/EditProduct';
import EditCategory from './editCategory/EditCategory';
import EditCategoryBtn from './editCategoryBtn/EditCategoryBtn';
import EditProductBtn from './editProductBtn/EditProductBtn';
import MenuBtn from './menuBtn/MenuBtn';
import LogOutBtn from './logOutBtn/LogOutBtn';

const SideBar = () => {
    const toggleMenu = useSelector(state => state.getToggleMenu);
    const toggleAdd = useSelector(state => state.getToggleAdd);
    const toggleEdit = useSelector(state => state.getToggleEdit);
    const toggleEditCategory = useSelector(state => state.getToggleEditCategory);

    return (
        <aside 
            className={`sidebar-dash-container 
            ${toggleMenu ? 'sidebar-hide' : 'sidebar-show'}`} 
        >
            <ul className='sidebar-first-nav'>
                <li><MenuBtn /></li>
                <li><LogOutBtn /></li>
            </ul>
            
            <ul className='sidebar-action-nav'>
                <li><AddBtn /></li>
                <li><EditProductBtn /></li>
                <li><EditCategoryBtn /></li>
            </ul>

            { toggleAdd ? <AddProduct /> : null }
            { toggleEdit ? <EditProduct /> : null }
            { toggleEditCategory ? <EditCategory /> : null }
        </aside>
    );
}

export default SideBar;