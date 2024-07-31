import formidable from "formidable"
import bcrypt from "bcrypt"
import db from "./../db.js"
import jwt from "jsonwebtoken"

const register = async(req, res) =>{
    
    let form = formidable()

    let emailRegex = /.{3}@[a-z]{5,}.[a-z]{3,}/gi 
    let pwdRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/g

    form.parse(req, (err, fields) =>{
        if(err){
            
            return res.status(500).json({message: 'Error processing form'})
        }else{
            const { email, password, name, dob } = fields



            if(email === "" || password === "" || name === "" || dob === ""){
                res.status(400).json({message:"all fields are required"})

            }else if(!emailRegex.test(email)){
                res.status(400).json({message: "Invalid email format"})

            }else if(!pwdRegex.test(password)){
                res.status(400).json({message:"password must contain alphabet, number and special character"})

            }else{
                // Add your database query here
                let sql = "SELECT * FROM users WHERE email = ?"

                db.query(sql,[email], async(err, rows) =>{
                    if(rows.length > 0){
                        res.status(400).json({message:"email already exists"})
                    }else{
                        let sql = "INSERT INTO users(name, email, password, dob) VALUES(?,?,?,?)"
                        
                        let salt = await bcrypt.genSalt(10)
                        let hashedpwd = await bcrypt?.hash(password.toString(), salt)
                        
                        
                        db.query(sql,[name, email, hashedpwd, dob],(err, result) =>{
                            if(err){

                                res.status(500).json({message: "error registering user"})
                            }else{
                                res.status(200).json({message: "user registered successfully"})
                            }
                        })
                    }
                })

            }
        }
    })

}

const login = async(req, res) =>{
    
    let form = formidable()

    form.parse(req, (err, fields) =>{
        let { email, password } = fields;

       

        let sql = "SELECT * FROM users WHERE email = ?"

        db.query(sql, [email, password], async(err, rows) =>{
            if(err){
                
                return res.status(500).json({message: 'Error processing form'})
            }else if(rows.length === 0){
                res.status(400).json({message: 'Invalid email or password'})
            }else{
                let user = rows[0]
              
                let match = await bcrypt.compare(password.toString(), user.password)

                if(match){
                    let token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: '3d'})
                    res.status(200).json({token, info:{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        dob: user.dob,
                        admin: user.admin
                    } })
                }else{
                    res.status(400).json({message: 'Invalid email or password'})
                }
            }
        })
    })
}


const updateUser = (req, res) =>{
    if(req.user === null){
        res.status(400).json({message: "invalid credentials"})
    }else{
        let form = formidable()
        form.parse(req, (err, fields) =>{
            let { name, dob } = fields
           
            let sql = "UPDATE users SET name = ?, dob = ? WHERE id = ?"
            db.query(sql, [name.toString(),dob.toString(),req.user.id],(err, rows) =>{
                if(err){
                    res.status(500).json({message: err.message})
                }else{
                    res.status(200).json({info:{
                        name,
                        dob
                    }})
                }
            })
        })
    }
}

export {
    register,
    login,
    updateUser
}