export const getClass = (type) => {
    if (type == 'None'){
        return 'missing'
    }
}

export const getClassLengthMoreThenZero = (num) => {
    if (num > 0){
        return 'missing'
    }
}

export const getClassLengthEqualZero = (num) => {
    if (num == 0){
        return 'missing'
    }
}

export const getIcon = (type) => {
    return type == 'None' ? '❌' :  '✅' 
}


export const getMetaLength = (metaLength) => {
    if(metaLength < 70){
        return  '❌ Meta Too Short - characters: ' + metaLength
    }
    
    if(metaLength > 160){
       return  '❌ Meta Too Long - haracters: ' + metaLength
    }

    return  '✅ Meta Length ok - characters: ' + metaLength
}


export const getTitleLength = (titleLength) => {
    if(titleLength < 30){
        return  '❌ Title Too Short - characters: ' + titleLength
    }
    
    if(titleLength > 60){
       return  '❌ Title Too Long - characters: ' + titleLength
    }

    return  '✅ Title Length ok - characters: ' + titleLength
}


export const  getIndent = (tag) => {
  switch (tag) {
    case "h1": return 0;
    case "h2": return 20;
    case "h3": return 40;
    default: return 0;
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}