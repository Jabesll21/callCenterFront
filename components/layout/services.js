import { config } from '../../js/config.js';

//get Actives
export async function getActives() {
    //url
    var url = config.api.url + "Session/Active";
    console.log(url);
    //fetch
    return await fetch(url)
        .then( (result) => { return result.json(); })
        .catch( (error) => { console.error(error) })
}
//get Answered
export async function getAnswered() {
    //url
    var url = config.api.url + "Session/Answered";
    console.log(url);
    //fetch
    return await fetch(url)
        .then( (result) => { return result.json(); })
        .catch( (error) => { console.error(error) })
}