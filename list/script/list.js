import { 
    checkAuth,
    logout,
    createListItem,
    getListItems,
    togglePurchased,
    deleteList,
} from '../../script/fetch-utils.js';

const logoutButton = document.getElementById(`logout`);
const deleteButton = document.getElementById(`delete-list`);
const form = document.getElementById(`form`);
const renderedList = document.getElementById(`rendered-list`);

checkAuth();

form.addEventListener(`submit`, async(e) =>{
    e.preventDefault();

    const data = new FormData(form);

    const quantity = data.get(`quantity-input`);
    const item = data.get(`item-input`);
    
    const qInput = document.getElementById(`quantity-input`);
    qInput.value = '';
    const iInput = document.getElementById(`item-input`);
    iInput.value = '';

    await createListItem(quantity, item);

    await fetchAndDisplayList();
});

logoutButton.addEventListener(`click`, () => {
    logout();
});

deleteButton.addEventListener(`click`, async() => {
    await deleteList();

    await fetchAndDisplayList();
});

async function fetchAndDisplayList(){
    const list = await getListItems();
    renderedList.textContent = '';
    
    for (let l of list){
        
        const div = document.createElement(`div`);

        if (l.purchased){
            div.classList.remove(`item-div`);
            div.classList.add(`item-div-purchased`, `flex-row`, `pad-left`);
        } else if (!l.purchased){
            div.classList.add(`item-div`, `flex-row`, `pad-left`);
        }

        const quantity = document.createElement(`p`);
        quantity.classList.add(`item-quantity`);
        quantity.textContent = l.quantity;
        
        const item = document.createElement(`p`);
        item.classList.add(`list-item`);
        item.textContent = l.item;
        
        div.append(quantity, item);
        
        renderedList.append(div);
        
        div.addEventListener(`click`, async() => {

            await togglePurchased(l.id);
            await fetchAndDisplayList();
            
        });
    }
}

window.addEventListener(`load`, async() => {
    await fetchAndDisplayList();
});

