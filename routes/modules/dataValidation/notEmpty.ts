import validator from "validator";
import CustomError from "../errors/errorClass";
export const notEmptyCheck=(object:object)=>{
    const {isEmpty,isLength}=validator;
    const responseBody=Object.entries(object);
    let validationCount=0;
    for(const item of responseBody){
        const [key,value]=item;
        if(isEmpty(value) && !isLength(value,{min:2})) break;
        else validationCount++;
    };
    return new Promise((resolve:Function,reject:Function):Boolean | Error=>(
        validationCount===responseBody.length?resolve(true):reject(
            new CustomError(`The field ${responseBody[validationCount][0]} is empty.`,400)
        )
    ));
};
