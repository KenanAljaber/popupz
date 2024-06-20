export default (app)=>{

    app.post('/upload',require('./upload').default);

}