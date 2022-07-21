import validator from "validator";

export const notEmptyCheck=(object:object)=>{
    const {isEmpty,isLength}=validator;
    const responseBody=Object.entries(object);
    let validationCount=0;
    for(const item of responseBody){
        const [key,value]=item;
        if(isEmpty(value) && !isLength(value,{min:2})) break;
        else validationCount++;
    };
    return (validationCount===responseBody.length);
};
