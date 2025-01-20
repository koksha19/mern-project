const getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        title: 'Post 1',
        content: 'Content',
        imageUrl: '/images/needful-things.png',
        creator: {
          name: 'Lev',
        },
        createdAt: Date.now(),
      },
      {
        title: 'Post 2',
        content: 'Content',
        imageUrl: '/images/needful-things.png',
        creator: {
          name: 'Bebra',
        },
        createdAt: Date.now(),
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
