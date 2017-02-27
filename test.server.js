let express = require('express'),
    nunjucks = require('nunjucks');

let app = express();

//express engine
app.engine('html', nunjucks.render);
app.set('view engine', 'html');
nunjucks.configure('./public', {
    autoescape: true,
    express: app
});

app.use(express.static('./public'));

app.get('/', (req, res) => {
    console.log(30);
    res.render('index');
});

app.listen(8080, function(){ console.log('test server is running on port 8080');})
