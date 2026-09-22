import http from 'node:http'

const videos = [
    {
    id: Math.random(), title: "video 1"
},
{
    id: Math.random(), title: "video 2"
},
]

const server = http.createServer((req,res)=>{
    if (req.method ==="GET" && req.url=== "/video")  {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(videos))
    }
})

server.listen(3000)
