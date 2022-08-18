const express = require("express")

const { exec } = require("child_process")

const app = express()


app.get("/" , (req, res) => { 

	res.sendFile( __dirname +"/index.html");
}) 

app.get("/runform" , (req, res) => {

        res.sendFile( __dirname +"/docker.html");
})



app.get("/ps", (req,res)=>{

	//exec("docker ps | tail -n +2 | awk '{ print $2,$7,$10}' " , (err, stdout, stderr)=> {
	//	res.send("<pre>" + stdout + "</pre>");
	//)}
	
	exec("docker ps | tail -n +2" , (err, stdout, stderr)=> {
		
		let a = stdout.split("\n");
		res.write("<table border='5' align='center' width='80%'>");
		res.write("<tr><th>Container ID</th><th>Image Name</th><th>Command</th><th>Container Name</th></tr>")

		a.forEach( ( cdetails ) => { 
			cinfo = cdetails.trim().split(/\s+/)
			console.log(cinfo[0] + " " + cinfo[1] + " " + cinfo[2])
			res.write("<tr>" + "<td>" + cinfo[0] + "</td>" + "<td>" + cinfo[1] + "</td>" + "<td>" + 
				cinfo[2] + "</td>" + "<td>" + cinfo[ cinfo.length - 1 ] + "</td>" + "</tr>")

		})

		res.write("</table>")
			res.send()
		//res.send("<pre>" + stdout + "</pre>");
	})
})


app.get("/listimages", (req,res)=>{


        exec("docker images | tail -n +2" , (err, stdout, stderr)=> {
		//res.send("<pre>" + stdout + "</pre>");

		let a = stdout.split("\n");
                res.write("<table border='5' align='center' width='80%'>");
                res.write("<tr><th>REPOSITORY</th><th>TAG</th><th>IMAGE ID</th></tr>")

                a.forEach( ( cdetails ) => {
                	cinfo = cdetails.trim().split(/\s+/)
                        console.log(cinfo[0] + " " + cinfo[1] + " " + cinfo[2])
                        res.write("<tr>" + "<td>" + cinfo[0] + "</td>" + "<td>" + cinfo[1] + "</td>" + "<td>" +
                                cinfo[2] + "</td>" + "</tr>")

		})

                
		res.write("</table>")
                res.send();
	})
})






app.get("/run", (req, res) => {
	const cname = req.query.cname;
	const cimage = req.query.cimage;

//	res.send(cimage);
	
	exec('docker run -dit --name ' + cname + " " + cimage, (err, stdout, stderr) => {
		console.log(stdout);
		res.send("<pre>" + cname + " Launched Successfully...</pre>")

		//res.send("<pre>" + stdout + "</pre> <a href='ps'>Click here to see all</a>");
	})

})


app.get("/deleteall", (req,res)=>{


        exec("docker rm -f $(docker ps -aq)" , (err, stdout, stderr)=> {


                        console.log(stdout + stderr)

                })

                res.send("<pre>" + stdout + "</pre>");
})


app.get("/deleteone", (req,res)=>{

	const cname = req.query.cnname;
	

//      res.send(cimage);

        exec('docker rm -f ' + cname , (err, stdout, stderr) => {
                console.log(stdout);

                res.send("<pre>" + cname + " Removed Successfully...</pre>")

	})

})

app.get("/execute", (req,res)=>{

        const cname = req.query.cname;
	const ccommand = req.query.command;

        exec('docker exec ' + cname + " " + ccommand, (err, stdout, stderr) => {
                console.log(stdout);
                res.send("<pre>" + stdout + "</pre>")
	})
})


app.get("/start", (req,res)=>{

        const cname = req.query.sname;

        exec("docker start " + cname , (err, stdout, stderr) => {
                console.log(stdout);
                res.send("<pre>" + cname + " started Successfully...</pre>")
        })
})

app.get("/stop", (req,res)=>{

        const cname = req.query.sname;

        exec("docker stop " + cname , (err, stdout, stderr) => {
                console.log(stdout);

                res.send("<pre>" + cname + " stopped Successfully...</pre>")
        })
})




app.get("/inspect", (req,res)=>{

        const cname = req.query.sname;

        exec("docker inspect " + cname , (err, stdout, stderr) => {
                console.log(stdout);
                res.send("<pre>" + stdout + "<pre>");
        })
})



app.listen(3000, () => { console.log("container app tool started ...")})
