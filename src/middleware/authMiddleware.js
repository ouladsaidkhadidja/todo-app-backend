import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next){
  const token = req.headers('auhtorization')
  if(!token) {return res.status(401).json({message: "No token provided"})}

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
    if(err) {return res.status(401).json({message: "Invalid token"})}

    req.userId = decoded.id 
    next()// you may now head to the endpoint

  })
}

export default authMiddleware