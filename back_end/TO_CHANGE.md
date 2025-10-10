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
    if (typeof obj[key] !== "object") {
      const renamedKey = key + (parentName ? "#" + parentName : "");
      flattenized.push({[renamedKey]: obj[key]});
    } else {
      if (obj[key] instanceof Array) {
        console.log("Flattenizing object: ", obj[key]);
        obj[key] = flattenizeObject(obj[key], key);
        console.log("Result: ", obj[key]);
      }
      flattenized = flattenized.concat(flattenizeObject(obj[key], key));
    }
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

  return flattenized;
}

const data = {
  id: 1,
  name: "Ma playlist",
  tracks: [
    {
      name: "Garçon",
      author: "Luther",
      duration: 120,
      subscribers: []
    },
    {
      name: "ALED",
      author: "Luther",
      duration: 220,
      subscribers: [
        {
          name: "John"
        },
        {
          name: "Franck"
        },
      ]
    }
  ]
}

const transformData = { // Variables
  id: "Id",
  name: "PlaylistName",
  tracks: [
    {
      name: "TrackName",
      author: "TrackAuthor",
      duration: "TrackDuration",
      subscribers: [
        {
          name: "SubscriberName"
        }
      ]
    },
  ]
}

const variables = transformToVariables(data, transformData);
console.log(variables);
```
