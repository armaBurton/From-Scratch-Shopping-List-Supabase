import { 
    checkAuth,
    logout,
    createListItem,
    getListItems,
    togglePurchased,
    deleteList,
    removeCheckedItems
} from '../../script/fetch-utils.js';

const logoutButton = document.getElementById(`logout`);
const deleteButton = document.getElementById(`delete-list`);
const form = document.getElementById(`form`);
const renderedList = document.getElementById(`rendered-list`);
const deleteChecked = document.getElementById(`delete-checked`);

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

deleteChecked.addEventListener(`click`, async() => {
    
    await removeCheckedItems();
    await fetchAndDisplayList();
});

async function fetchAndDisplayList(){
    const list = await getListItems();
    renderedList.textContent = '';

    for (let l of list){

        const listItem = renderItem(l);
        renderedList.append(listItem);

    }
}

function renderItem(l){
    const div = document.createElement(`div`);
    
    if (l.purchased){
        div.classList.remove(`item-div`);
        div.classList.add(`item-div-purchased`, `flex-row`, `pad-left`);
    } else if (!l.purchased){
        div.classList.add(`item-div`, `flex-row`, `pad-left`);
    }
    
    const checkbox = document.createElement(`input`);
    checkbox.type = `checkbox`;
    checkbox.name = `check-list-item`;
    checkbox.classList.add(`checkbox`);

    checkbox.id = l.id;

    const doubleDiv = document.createElement(`div`);
    doubleDiv.classList.add(`double-div`);
    
    const quantity = document.createElement(`p`);
    quantity.classList.add(`item-quantity`);
    quantity.textContent = l.quantity;
    
    const item = document.createElement(`p`);
    item.classList.add(`list-item`);
    item.textContent = l.item;
        
    // div.appendChild(label);
    div.append(quantity, item);
    doubleDiv.append(checkbox, div);
    
    div.addEventListener(`click`, async() => {
        await togglePurchased(l.id);
        await fetchAndDisplayList();

    });
    return doubleDiv;
}

window.addEventListener(`load`, async() => {
    await fetchAndDisplayList();
});