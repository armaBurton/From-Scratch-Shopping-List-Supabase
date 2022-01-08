import { 
    checkAuth,
    logout,
    createListItem,
    getListItems,
    togglePurchased,
    toggleRepurchase,
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

function renderItem(listUnit){


    const div = document.createElement(`div`);
    
    const checkbox = document.createElement(`input`);
    checkbox.type = `checkbox`;
    checkbox.name = `check-list-item`;
    checkbox.classList.add(`checkbox`);
    
    checkbox.id = listUnit.id;
    
    const doubleDiv = document.createElement(`div`);
    doubleDiv.classList.add(`double-div`);
    
    const quantity = document.createElement(`p`);
    quantity.classList.add(`item-quantity`);
    quantity.textContent = listUnit.quantity;
    
    const item = document.createElement(`p`);
    item.classList.add(`list-item`);
    item.textContent = listUnit.item;
    
    const span = document.createElement(`p`);
    span.textContent = `⭮`;
    span.classList.add(`reAdd`);
    
    
    
    if (listUnit.purchased){
        div.classList.remove(`item-div`);
        div.classList.add(`item-div-purchased`, `flex-row`, `pad-left`);
        quantity.classList.add(`text-decoration`);
        item.classList.add(`text-decoration`);
        span.classList.add(`text-decoration-none`);
        span.addEventListener(`click`, async() => {
            await toggleRepurchase(listUnit.id);
            await fetchAndDisplayList();
        });
        // item.append(span);
        div.append(quantity, item, span);
    } else if (!listUnit.purchased){
        div.classList.add(`item-div`, `flex-row`, `pad-left`);
        div.append(quantity, item);
    }
    // div.appendChild(label);
    doubleDiv.append(checkbox, div);
    
    div.addEventListener(`click`, async() => {
        await togglePurchased(listUnit.id);
        await fetchAndDisplayList();
        
    });
    return doubleDiv;
}

window.addEventListener(`load`, async() => {
    await fetchAndDisplayList();
});