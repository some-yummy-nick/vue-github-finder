export default function loadMore(res,LENGTH) {
    const messages = [];
    if (res.length > LENGTH) {
        for (let i = 0; i < LENGTH; i++) {
            res[i].main = true;
            messages.push(res[i])
        }
        return messages;
    } else {
        for (let i = 0; i < res.length; i++) {
            res[i].main = true;
            messages.push(res[i])
        }
        return messages;
    }
}
