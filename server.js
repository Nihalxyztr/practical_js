const http = require('http');
const fs = require('fs');
const os = require('os');
const path= require('path');
// get/update user - Append a new user with correct time stamp 
// get/savelog= read out and return full contnent of visitors.log 
//post/backup - copy content of visitors.log to a new file backlog.log
// get/clearlog- clear content of vsiotor log 
//get/serverinfo return system info in json format 

const PORT= 3000;
const log = path.join(__dirname,'visitors.log');

const backup= path.join(__dirname,'backup.log');

if(!fs.existsSync(log)){
    fs.writeFileSync(log,' ');
}
const server = http.createServer((req,res)=>{
    if(req.method=='GET' && req.url=='/updateUser'){
        const time= new Date().toString() +'\n';

        fs.appendFile(log,time,(err)=>{
            if(err)res.write("error");
            else res.write("user updated");
            res.end();
        });
    }
    else if(req.method=='GET' && req.url=='/saveLog'){
        fs.readFile(log,'utf-8',(err,data)=>{
            if(err){
               res.write('error')
            }
            else{
                res.write(data)
            }
            res.end();
        });
    }
    else if(req.method=='POST' && req.url=='/backup'){
        fs.readFile(log,'utf-8',(err,data)=>{
            if(err){
                res.write('error');
                res.end();
            };
            fs.writeFile(backup,data,(err)=>{
                if(err){
                    res.write("error");

                }
                else res.write("backup done");
                res.end();
            });
        });
    }
    else if(req.method=='GET' && req.url=='/clearlog'){
        fs.writeFile(log,' ',(err)=>{
            if(err)res.write("error");
            else res.write("cleared");
            res.end();
        });
    }
    else if(req.method=='GET' && req.url=='/serverinfo'){
        const info={
            platform:os.platform(),
            architecture:os.arch(),
            totalSpace:os.totalmem(),
            freeSpace:os.freemem()
        }
        res.write(JSON.stringfy(info));
        res.end();
    }
    else {
        res.write("not found");
        res.end();
    }
});

server.listen(PORT,()=>{
    console.log("running on 3000");
})