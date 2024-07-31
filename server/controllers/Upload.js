import formidable from "formidable"
import bcrypt from "bcrypt"
import db from "./../db.js"
import jwt from "jsonwebtoken"
import fs from "fs"

import dotenv from "dotenv"

dotenv.config()

import cloudinary from "cloudinary"


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
    secure: true
})

const upload = (req, res) =>{
    if(req.user === null){
        res.status(400).json({message: "invalid credentials"})
    }else{
        let form = formidable({
            multiples: false,
           allowEmptyFiles: false
        })
        form.parse(req, async(err, fields, files) =>{
            let { title, price } = fields
            let { poster } = files

            // console.log(poster[0].filepath);
            // console.log(poster[0].originalFilename);
            await cloudinary.uploader.upload(poster[0]?.filepath, async (data) =>{
                // console.log(err);
                let sql = "insert into upload(title, price, poster) values(?,?,?)"

                db.query(sql,[title, price, data?.secure_url], (err) =>{
                    if(err) {
                        res.status(400).json({message: "unable to processform"})
                    }else{

                    
                    res.json({message: "movie uploaded successfully"})
                    }
                })
            })

        })
    }
}


const getAllMovies = (req,res) =>{
    let sql = "select * from upload"

    db.query(sql, (err, rows) =>{
        res.status(200).send(rows)
    })
}

export {
    upload,
    getAllMovies
}