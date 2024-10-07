import Renderer from'./renderer.js';

let renderer = new Renderer({
    "url": "https://zeroplex.ttttw/",
})

try {
    let result = await renderer.run()
    console.log(result)
} catch (e) {
    console.log(e)
}
