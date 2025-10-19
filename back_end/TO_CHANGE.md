Dans la table zap_steps :
- Enlever le "not null" du connection_id (zap step ne nécessite pas forcément une connection, par exemple pour le schedule pas besoin de connection)

Dans la table triggers :
- Ajouter un boolean "require_connection" par défaut sur true
- Ajouter "variables" en "transform_variable_schema" (voir code en bas)

Dans la table actions :
- Ajouter "variables" en "transform_variable_schema" (voir code en bas)

Dans la table http_requests :
- Retirer le "body_schema" et le "header_schema" (Inutile étant donné que ça sera codé en "dur" dans les classes des triggers / actions)
- Ajouter un "s" au nom de la table pour suivre la convention

Dans la table webhooks :
- Retirer le "body_schema" et le "header_schema" (Inutile car codé en "dur" dans les classes)
- Ajouter "action" string [not null] et "event" string [not null]
- @unique([action, event, from_url])
- @primary(id)


Dans la table connections :
- @primary(id)
- @unique([user_id, service_id, account_identifier]) // Un user ne peut pas relier plusieurs fois le même compte sur un service


Transform data:
```js
function arrayToObject(array) {
    const obj = {};

    for (const val of array) {
        const key = Object.keys(val);
        obj[key] = val[key];
    }
    return obj;
}

function flattenizeObject(obj, parentName=null) {
    let flattenized = [];

    for (const key of Object.keys(obj)) {
        if (typeof obj[key] !== 'object')
            flattenized.push({[key]: obj[key]});
        else
            flattenized = flattenized.concat(flattenizeObject(obj[key], key));
    }
    return flattenized;
}

function renameObjectWithKeys(obj, keys) {
    const renamed = {};

    if (obj instanceof Array)
        return obj.map(item => renameObjectWithKeys(item, keys[0]));

    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            renamed[key] = renameObjectWithKeys(obj[key], keys[key]);
        } else {
            renamed[keys[key]] = obj[key];
        }
    }
    return renamed;
}

function transformToVariables(obj, variablesTransformer) {
    const renamed = renameObjectWithKeys(obj, variablesTransformer);
    const flattenized = flattenizeObject(renamed);
    return arrayToObject(flattenized);
}

const data = {
    id: 1,
    name: "Ma playlist",
    track: {
        name: "Garçon",
        author: "Luther",
        duration: 120,
        subscribers: []
    }
}

const transformData = { // Variables
    id: "Id",
    name: "PlaylistName",
    track: {
        name: "TrackName",
        author: "TrackAuthor",
        duration: "TrackDuration",
    }
}

const variables = transformToVariables(data, transformData);
console.log(variables);


// const data = {
//   id: 1,
//   name: 'Ma playlist',
//   track: {
//     name: 'Garçon',
//     author: 'Luther',
//     duration: 120,
//   },
// };
//
// const transformData = {
//   id: 'Id',
//   name: 'PlaylistName',
//   track: {
//     name: 'TrackName',
//     author: 'TrackAuthor',
//     duration: 'TrackDuration',
//   },
// };
//
// const variables = JsonValueParser.transformResponseToVariables(
//   data,
//   transformData,
// );
// console.log(variables);
```
