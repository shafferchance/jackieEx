export function translate (obj) {
    // console.log(obj);
    for (const entry in obj) {
        if (obj[entry] === undefined) continue;
        if (obj[entry].constructor !== Function) continue;
        obj[entry] = functionToString(obj[entry].toString());
    }
    return obj;
}

function functionToString(funct) {
    let str = funct.split('\n');
    let params = str[0].match(/\(([a-zA-Z0-9,\s_]+)\)|([a-zA-Z0-9]+) =>/);
    params = params[1] === undefined ? params[2] : params[1].trim().split(',');
    if (str.length === 1) {
        return {params: params, funct: funct}
    }
    str.splice(0, 1);
    str.pop(); 
    return {params: params, funct: str.join('\n')};
}