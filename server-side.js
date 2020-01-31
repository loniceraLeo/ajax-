'uses strict'
const clog=console.log;
const cerr=console.error;

const http=require('http');
const {URL}=require('url');
const fs=require('fs');

let clientui=require('fs').readFileSync('./index.html');  //index.html在同目录下
let count=0;

let clients=[];     //客户端数组

let server=http.createServer((req,res)=>{           
	clog(req.url+' '+req.method+' '+new Date().toString());       //TEST-Uesd 工作日志
	req.setEncoding('utf8');

	if (req.url!=='/chat' && req.url!=='/'){                      //默认只提供聊天功能
		res.writeHead(404,{'content-type':'text/plain;charset=utf8'});  
		res.end('404 not found');
		return;
	}
	else if (req.url==='/'){                                      
		res.writeHead(200,{'content-type':'text/html;charset=utf8'});
		res.write(`目前在线人数:${++count}`);                       //该部分未实现ajax
		res.end(clientui);                                          //在页面上打印ui
		return;
	}

	else if (req.url==='/chat' && req.method==='POST'){           //新消息推送
		let body='';
		req.on('data',$=>body+=$);
		req.on('end',$=>{
			clog(body);                                                //工作日志
      //这里不能再写消息头了否则会报错
			clients.forEach(client=>{
				client.write('data: '+body+'\r\n\r\n');
			});
		});
	}
	else if (req.url==='/chat' && req.method=='GET'){
		res.writeHead(200,{'content-type':'text/event-stream;charset=UTF-8'});
		clients.push(res);
		req.socket.on('end',$=>{
			clients.splice(clients.indexOf(res),1);
			res.end();
		})
	}
});
server.listen(1000,$=>{clog('监听中')});
