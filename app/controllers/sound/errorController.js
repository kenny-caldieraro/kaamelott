module.exports = {
  error404(_, res) {
    res.status(404).json({
      error: '404',
      message: 'Not found',
    });
  },
};
