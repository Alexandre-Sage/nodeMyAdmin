declare interface HeaderObject{
    status:number,
    contentType:string,
    origin:string | Array<string>,
    cookie:boolean
};

declare interface AssertBodyObj{
    redirectsLength:number,
    propertyArray?:Array<BodyPropertyObj>
}

declare interface BodyPropertyObj{
    propertyName:string,
    propertyValue:/*number | string | boolean | Array<object> | Array<string> |*/ any ,
};

declare interface ErrorObject{
   serverError:boolean,
   clientError:boolean,
   badRequest:boolean
};

export {AssertBodyObj,ErrorObject,BodyPropertyObj,HeaderObject};
