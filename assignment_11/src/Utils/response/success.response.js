
export const successResponse = ({
    res , statusCode = 200 , message = "done" , data = {}
})=>{
    return res.status(statusCode).json({message , data});
}

/*
// ex:
    successResponse({
        res , statusCode: 201 , message: "successfully"
    });
*/