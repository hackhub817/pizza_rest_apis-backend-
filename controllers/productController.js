
const {Product} = require("../models")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Joi=require("joi");
const CustomErrorHandler =require('../services/CustomErrorHandler');

// //multer ham isliye use ka rahe h taaki ham users se photo bhi le paaye 
// woh ham multer ka use karke hi kar sktay h
//BASICALLY FOR UPLOADING A FILE
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    
    //File ka name use kar rahe h to yeh 
   // 3746674586-836534453.png iss formate main file name aa jayega
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${path.extname(file.originalname)}`;
        //yeh path.ext hamne use kiya taaki ham file ki extension ka pata kar paaye
        //original fike name ka jo extension h woh uska naam
        cb(null, uniqueName);
    },
});

//function of the multer jaha pe ham storage ko call karegay
//with the limit we we will se the limit of the uploads
const handleMultipartData = multer({
    storage,
    limits: { fileSize: 1000000 * 5 },
}).single('image'); // 5mb

const productController={
    async store(req , res, next){
        //MUTLIPART FORM DATA
          // Multipart form data
          handleMultipartData(req, res, async(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
              console.log(req.file);
              const filePath=req.file.path;

                    // validation
                  const productSchema= Joi.object({
                    name:Joi.string().required(),
                    price:Joi.number().required(),
                    size:Joi.string().required(),
                  });
                //   const refreshSchema=Joi.object({
                //     refresh_token:Joi.string().required()
                // });

                  const {error} = productSchema.validate(req.body);
                  if(error)
                  {
                   //if error aa jaati h to image jo uplaod ho gayi h usse delete akregau

                   //UNLINK MODULE is the INBUILD MODEULE IN NODE TO DELTE THE FILE
                   fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err)
                    {
                    return next(CustomErrorHandler.serverError(err.message));
                    }
                   }
                   ) ;

                   return next(error);
                   // WE WANT EXPRESS IT INTO  rootfolder/upload/filename.png
                }

            // const filePath=req.file.path;
            
            //DATABASE MAIN PRODUCTS KI DETAILS USE KAR RAHE H
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    // SIMILAR AS 
                    //name:name;
                    name,
                    price,
                    size,
                    image: filePath,
                });
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        });

    },
    update(req,res,next){
        handleMultipartData(req, res, async(err) => {
            if (err) {
                return next(CustomErrorHandler.serverError(err.message));
            }
            let filePath;
              if(req.file)
              {
               filePath=req.file.path;
              }

                    // validation
                  const productSchema= Joi.object({
                    name:Joi.string().required(),
                    price:Joi.number().required(),
                    size:Joi.string().required(),
                  });
                //   const refreshSchema=Joi.object({
                //     refresh_token:Joi.string().required()
                // });

                  const {error} = productSchema.validate(req.body);
                  if(error)
                  {
                   //if error aa jaati h to image jo uplaod ho gayi h usse delete akregau

                   //UNLINK MODULE is the INBUILD MODEULE IN NODE TO DELTE THE FILE
                 
                   if(req.file){

                   fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err)
                    {
                    return next(CustomErrorHandler.serverError(err.message));
                    }
                   }
                   ) ;

                   return next(error);
                   // WE WANT EXPRESS IT INTO  rootfolder/upload/filename.png
                }
            }

            // const filePath=req.file.path;
            
            //DATABASE MAIN PRODUCTS KI DETAILS USE KAR RAHE H
            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.findOneAndUpdate({_id:req.params.id}, {
                    // SIMILAR AS 
                    //name:name;
                    name,
                    price,
                    size,
                    ...(req.file &&{image:filePath})
                },{new:true});
                //new : true is use to ge the latest info after update 
            } catch (err) {
                return next(err);
            }
            res.status(201).json(document);
        }); 

    },
    async destroy(req, res, next) {
        const document = await Product.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // image delete
        const imagePath = document._doc.image;
        // http://localhost:5000/uploads/1616444052539-425006577.png
        // approot/http://localhost:5000/uploads/1616444052539-425006577.png
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if (err) {
                return next(CustomErrorHandler.serverError());
            }
            return res.json(document);
        });
    },
    async index(req, res, next) {
        let documents;
        // pagination mongoose-pagination
        try {
            documents = await Product.find()
                .select('-updatedAt -__v')
                .sort({ _id: -1 });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
    async show(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ _id: req.params.id }).select(
                '-updatedAt -__v'
            );
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    }
}



module.exports=productController;