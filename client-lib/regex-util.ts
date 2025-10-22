export function antStringToRegex(string: string) {
    if (!string.endsWith('*')) {
        string += '$';
    }
    return string.replace('/', '\\/').replace('**', '*');
}