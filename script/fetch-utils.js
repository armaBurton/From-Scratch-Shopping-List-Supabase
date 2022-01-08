const SUPABASE_URL = 'https://zbycmansaybtrruijgxp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTUxMTkyNiwiZXhwIjoxOTU3MDg3OTI2fQ.Ni09YI3wnnjziemmdKAzYVvr69wg_bpWKc2CZVgzl_M';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


export async function getUser() {
    return client.auth.session();
}

export async function createListItem(quantity, item){
    const response = await client
        .from(`list`)
        .insert([
            {
                quantity,
                item,
            }
        ]);
    
    return checkError(response);
}

export async function togglePurchased(id){
    const response = await client
        .from(`list`)
        .update({ purchased: true })
        .match({ id });

    return checkError(response);
}

export async function toggleRepurchase(id){
    const response = await client
        .from(`list`)
        .update({ purchased: false })
        .match({ id });

    return checkError(response);
}

export async function getListItems(){
    const response = await client
        .from(`list`)
        .select();

    return checkError(response);
}

export async function deleteList(){
    const response = await client
        .from(`list`)
        .delete();

    return checkError(response);
}

export async function removeCheckedItems(){
    const checkboxes = document.querySelectorAll(`.checkbox:checked`);

    for (let c of checkboxes){
        console.log(c);
        await deleteListItem(c.id);
    }
    Array.prototype.forEach.call(checkboxes, async(checkbox) => {
        console.log(checkbox);
        checkbox.closest(`div`).remove();
        await deleteListItem();
    });
}

async function deleteListItem(id){
    const response = await client
        .from(`list`)
        .delete()
        .match({ id })
        .single();

    return checkError(response);
}

export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./list');
    }
}

export async function signUpUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}