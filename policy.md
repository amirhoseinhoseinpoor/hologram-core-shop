module structure
    [module name]
        |
         -- controller
        |   use for: API
        |   input  : DTO
        |   output : DTO
        |
         -- service 
        |   use for: business, exception handling and casting DTO to Model (asModel)
        |   input  : DTO
        |   output : Model
        |   return : Ok or NotOk / Specific Model
        |
         -- repository
        |   use for: DB
        |   input  : Model
        |   return : object Model