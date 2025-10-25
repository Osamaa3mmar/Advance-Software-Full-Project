import { UsersRepository } from "../Repositories/UsersRepository.js"
export class UsersServices {

    static getAllUsers=async (name)=>{
        if(name=="osama"){

            return await UsersRepository.getAllUsers();
        }
        return null;
    }
    static getUserById=async(userId)=>{
        return await UsersRepository.getUserById(userId);
    }
}