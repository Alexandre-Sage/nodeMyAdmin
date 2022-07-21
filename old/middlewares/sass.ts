import sassMiddleware from "node-sass-middleware";
import path from "path";

const sass=sassMiddleware({
    src: __dirname+"/src/styles/scss",
    dest: path.join(__dirname, '../src/styles/css'),
    debug: process.env.NODE_ENV==="styling"?true:false,
    indentedSyntax:false,
    error:(err:void)=>console.log(err),
    outputStyle: 'compressed',
});
export default sass;
