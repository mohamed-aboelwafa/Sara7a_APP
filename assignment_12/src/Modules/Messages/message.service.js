
export const welcome = async(req,res)=>{
    successRes({
        res:res, message: "welcome from messsage.service.js", status: 200, data:{ }
    });
}