##下面的例子将演示客户端如何从数据库中抓取数据  

现在我们在开发一个基于Vue的blog主题，首页需要显示数据库中第一篇文章的标题,这时候我们可以用ajax实现。  

`fetchData(id) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `/post/${id}`);
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send();
      xhr.onload = () => {
        this.loading = false;
        this.post = JSON.parse(xhr.responseText)[0];
      }
 }`
 
 id是文章的索引，默认在数据库中已经按照新旧顺序排序，所以我们直接拿出最新的一个字段，访问/post/1  
 
 在nodejs端中:  
 
 `let connection = mysql.createConnection(DBConfig);
        const id = parseInt(_url.pathname.split('\/')[ 2 ]);
        connection.connect((err) => {     //ignore the error sliently
            if (err) console.log(err) ;
        });
        connection.query(`select * from post where id=${id}` ,(err, results, fields) => {
            if (err) void 0;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
  });`
  
  如果DBconfig配置完全正确，那么关于这个字段的一切信息将会被封装在json格式中返回客户端，然后我们渲染对象中的title属性就行了
