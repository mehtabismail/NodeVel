/**
 * @class UserController
 * @description Handles all user related CRUD operations
 */
 module.exports = class UserController {
    /**
     * @constructor
     * @description Handles autoloaded dependencies
     */
    constructor(app) {
      this.user_model = app.get("LoginModel"); // user
      this.user_validator = app.get("LoginValidator");
      this.upload_helper = app.get("UploadHelper");
    }
  
    /**
     * @method index
     * @description Returns list of User
     * @param {object} request
     * @param {object} response
     * @return {image} response
     */
    async index(request, response) {
      try {
        
        let filters = await this.user_validator.validateRequestWithFilters(request, response)

        let user = await this.user_model
          .find(filters.search)
        
          .skip(filters.query.skip)
          .limit(filters.query.limit)
          .sort(filters.query.sort)
          .select(filters.projection)
          .lean();
        let total = await this.user_model.countDocuments(filters.search);
  
        /** Response */
        return response.status(200).json({
          pagination: {
            skip: filters.query.skip,
            limit: filters.query.limit,
            total,
          },
          user,
        });
       } 
       catch (err) {
        logger.log({
          level: "error",
          message: err,
        });
        return response.status(400).send({ message: "Something went wrong" });
      }
    }
  
   /**
   * @method store
   * @description Create new user
   * @param {object} request
   * @param {object} response
   * @return {object} response
   */
    async store(request, response) {
      try {
      
        let validation = await this.user_validator.validateStoreRequest(
          request,
          response,
          this.user_model
        )
        if (validation.error)
          return response
            .status(400)
            .json({ message: 'Validation error', errors: validation.errors })
       
        // hash password
        request.body.password = auth.hashPassword(
          request.body.password,
          Config.app('salt')
        )
        //set created by
        // request.body.created_by = request.user.email;
  
        /* Response */
        let user = await this.user_model.create(request.body)
        return response.status(200).json({
          message: 'User created successfully',
          user: user,
          token: auth.generateToken(user._id.toString())
        })
      } catch (err) {
        logger.log({
          level: 'error',
          message: err
        })
        return response.status(400).send({ message: 'Something went wrong' })
      }
    }
  
    /**
     * @method show
     * @description Returns single user based on provided id
     * @param {object} request
     * @param {object} response
     * @return {object} response
     */
    async show(request, response) {
      try {
        /** Request validation */
        let result = this.user_validator.validateUserIdWithProjection(request);
        if (result.error)
          return response
            .status(400)
            .json({ message: "Validation error", errors: result.errors });
  
        let user = await this.user_model
          .findOne({ _id: request.params.id })
         
        if (!user)
          return response.status(400).json({ message: "User does not exist" });
  
        /** Response */
        return response.status(200).json(user);
      } catch (err) {
        logger.log({
          level: "error",
          message: err,
        });
        return response.status(400).send({ message: "Something went wrong" });
      }
    }
  
    /**
     * @method update
     * @description Update User
     * @param {object} request
     * @param {object} response
     * @return {object} response
     */
    async update(request, response) {
      try {
        /** Request validation */
        let validation = await this.user_validator.validateUpdateRequest(
          request,
          response,
          this.user_model
        );
        if (validation.error)
          return response
            .status(400)
            .json({ message: "Validation error", errors: validation.errors });
  
        request.body.updated_by = request.user.email;
       if(request.body.password){
        request.body.password =  auth.hashPassword(
          request.body.password,
          Config.app('salt')
        )
       }

        let updated = await this.user_model.findOneAndUpdate(
          { _id: request.params.id },
          {
            $set: request.body,
          },
          { new: true, useFindAndModify: false }
        );

        


  
        /** Response */
        return response
          .status(200)
          .json({ message: "User updated successfully", user: updated });
      } catch (err) {
        logger.log({
          level: "error",
          message: err,
        });
        return response.status(400).send({ message: "Something went wrong" });
      }
    }
  
    /**
     * @method destroy
     * @description delete User
     * @param {object} request
     * @param {object} response
     * @return {object} response
     */
    async destroy(request, response) {
      try {
        /** Request validation */
        let result = this.user_validator.validateUserIdWithProjection(request);
        if (result.error)
          return response
            .status(400)
            .json({ message: "Validation error", errors: result.errors });
  

        let user = await this.user_model.findOne({ _id: request.params.id });

        user.remove();
  
        /** Response */
        return response
          .status(200)
          .json({ message: "User deleted successfully" });
      } catch (err) {
        logger.log({
          level: "error",
          message: err,
        });
        return response.status(400).send({ message: "Something went wrong" });
      }
    }
  
    /**
     * @method profileImage
     * @description Returns a user profile image
     * @param {object} request
     * @param {object} response
     * @return {image} response
     */
    async profileImage(request, response) {
      try {
        /** Request validation */
        let result = await this.user_validator.doesImageExist(request);
        if (result.error)
          return response
            .status(400)
            .json({ message: "Validation error", errors: result.errors });
  
        let file_path =
          root_directory + "/public/user_images/" + request.params.filename;
        return response.sendFile(file_path);
      } catch (err) {
        logger.log({
          level: "error",
          message: err,
        });
        return response.status(400).send({ message: "Something went wrong" });
      }
    }
  
  }
  