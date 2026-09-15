   
import  { mongoose , model } from "mongoose";
import {GenderEnum, RoleEnum, ProviderEnum} from "../../Utils/enums/user.enum.js";
import { type } from "node:os";

const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: [true, "firstName is required"],
            minlength: 2,
            maxlength: 25,
        },
        lastName:{
            type: String,
            required: [true, "lastName is required"],
            minlength: 2,
            maxlength: 25,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: function(){
                return this.provider === ProviderEnum.SYSTEM;
            },
        },
        DOB: Date,
        phone: {
            type: String,
            required: function () {
                return this.provider === ProviderEnum.SYSTEM;
            }
        },
        gender:{
            type: Number,
            enum: Object.values(GenderEnum),
            default: GenderEnum.MALE,
        },
        provider:{
            type: Number,
            enum: Object.values(ProviderEnum),
            default: ProviderEnum.SYSTEM,
        },
        role:{
            type: Number,
            enum: Object.values(RoleEnum),
            default: RoleEnum.USER, 
        },
        confirmEmail: Date,
        profilePic: String,
        profilePictures: [String],
        coverPictures: [String],
        profileVisitCount: {
            type: Number,
            default: 0,
        },
        changeCredentilasTime: Date,
    },
    {
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: {virtuals: true},
    },
);

userSchema.virtual("username")
    .set(function(value){
        const [firstName,lastName] = value?.split(" ") || [];
        this.set("firstName", firstName)
        this.set("lastName", lastName)
    })
    .get(
        function(){
            return this.firstName + " " + this.lastName;
        }
    );


// const UserModel = model.User || model("User",userSchema);

const UserModel =
    mongoose.models.User || mongoose.model("User", userSchema);


export default UserModel;
