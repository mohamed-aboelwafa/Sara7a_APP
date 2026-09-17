export function generateOTP(){
    return Math.floor(Math.random() * (800000 + 100000) + 100000).toString(); 
    // generate 6 random numbers each time in a spcefic range
}
