const { app } = require('./src/router');

const port = process.env.PORT;

app.listen(port, () => console.log(`server is listening on ${port}`));
