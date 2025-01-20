const getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        id: 1,
        name: 'Lev',
        surname: 'Bereza',
      },
    ],
  });
};

const createPost = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;

  res.status(201).json({
    message: 'Successfully created a new post',
    data: { id: new Date(), name: name, surname: surname },
  });
};

module.exports = { getPosts, createPost };
