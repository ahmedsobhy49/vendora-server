class AuthControllers {
  adminLogin = async (req, res) => {
    console.log(req.body);
    res.json({
      message: "success",
    });
  };
}

const authControllers = new AuthControllers();

export default authControllers;
