export default function getCookie(name){
    const stroke = document.cookie;
    const rookie = stroke.split("; ");
    for (let i = 0; i < rookie.length; i++) {
        const arr = rookie[i].split("=");
        if (arr[0] === name){
            return arr[1];
        }
    }
    return "";
}
